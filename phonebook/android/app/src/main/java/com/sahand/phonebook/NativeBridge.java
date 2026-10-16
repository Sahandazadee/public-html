package com.sahand.phonebook;

import android.Manifest;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.view.WindowManager;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.fragment.app.FragmentActivity;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.security.KeyStore;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyPermanentlyInvalidatedException;
import android.security.keystore.KeyProperties;

/**
 * Offline-only native helpers: save files to Documents/PhoneBook (survives uninstall),
 * share files/text through the Android share sheet, biometric unlock, FLAG_SECURE toggle.
 */
@CapacitorPlugin(
    name = "NativeBridge",
    permissions = {
        @Permission(strings = { Manifest.permission.WRITE_EXTERNAL_STORAGE }, alias = "storage")
    }
)
public class NativeBridge extends Plugin {
    private static final String REL_DIR = "Documents/PhoneBook";

    // ---------- save to public Documents/PhoneBook ----------
    @PluginMethod
    public void saveFile(PluginCall call) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q
            && getPermissionState("storage") != com.getcapacitor.PermissionState.GRANTED) {
            requestPermissionForAlias("storage", call, "storagePermsCallback");
            return;
        }
        doSave(call);
    }

    @PermissionCallback
    private void storagePermsCallback(PluginCall call) {
        if (getPermissionState("storage") == com.getcapacitor.PermissionState.GRANTED) {
            doSave(call);
        } else {
            call.reject("Storage permission denied");
        }
    }

    private void doSave(PluginCall call) {
        String name = call.getString("name");
        String mime = call.getString("mime", "application/octet-stream");
        String b64 = call.getString("base64");
        if (name == null || b64 == null) {
            call.reject("name and base64 are required");
            return;
        }
        name = name.replaceAll("[\\\\/:*?\"<>|]", "_");
        try {
            byte[] data = Base64.decode(b64, Base64.DEFAULT);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                ContentResolver r = getContext().getContentResolver();
                Uri col = MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY);
                Uri target = null;
                try (Cursor c = r.query(col, new String[] { MediaStore.MediaColumns._ID },
                    MediaStore.MediaColumns.DISPLAY_NAME + "=? AND " + MediaStore.MediaColumns.RELATIVE_PATH + "=?",
                    new String[] { name, REL_DIR + "/" }, null)) {
                    if (c != null && c.moveToFirst()) {
                        target = android.content.ContentUris.withAppendedId(col, c.getLong(0));
                    }
                }
                OutputStream os = null;
                if (target != null) {
                    try { os = r.openOutputStream(target, "wt"); } catch (Exception e) { os = null; }
                }
                if (os == null) {
                    ContentValues v = new ContentValues();
                    v.put(MediaStore.MediaColumns.DISPLAY_NAME, name);
                    v.put(MediaStore.MediaColumns.MIME_TYPE, mime);
                    v.put(MediaStore.MediaColumns.RELATIVE_PATH, REL_DIR);
                    target = r.insert(col, v);
                    if (target == null) throw new Exception("Could not create file");
                    os = r.openOutputStream(target, "wt");
                }
                try { os.write(data); os.flush(); } finally { os.close(); }
            } else {
                File dir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS), "PhoneBook");
                if (!dir.exists() && !dir.mkdirs()) throw new Exception("Could not create folder");
                try (FileOutputStream fos = new FileOutputStream(new File(dir, name))) { fos.write(data); }
            }
            JSObject ret = new JSObject();
            ret.put("path", REL_DIR + "/" + name);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Save failed: " + e.getMessage());
        }
    }

    // ---------- share ----------
    @PluginMethod
    public void share(PluginCall call) {
        String text = call.getString("text");
        String name = call.getString("name");
        String mime = call.getString("mime", "text/plain");
        String b64 = call.getString("base64");
        try {
            Intent send = new Intent(Intent.ACTION_SEND);
            if (b64 != null && name != null) {
                File dir = new File(getContext().getCacheDir(), "share");
                if (!dir.exists()) dir.mkdirs();
                File f = new File(dir, name.replaceAll("[\\\\/:*?\"<>|]", "_"));
                try (FileOutputStream fos = new FileOutputStream(f)) {
                    fos.write(Base64.decode(b64, Base64.DEFAULT));
                }
                Uri uri = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", f);
                send.setType(mime);
                send.putExtra(Intent.EXTRA_STREAM, uri);
                send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            } else {
                send.setType("text/plain");
            }
            if (text != null) send.putExtra(Intent.EXTRA_TEXT, text);
            Intent chooser = Intent.createChooser(send, call.getString("title", "Share"));
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(chooser);
            call.resolve();
        } catch (Exception e) {
            call.reject("Share failed: " + e.getMessage());
        }
    }

    // ---------- biometrics: the data key is sealed by a hardware (Keystore) key that needs a fingerprint ----------
    private static final String KS = "AndroidKeyStore";
    private static final String ALIAS = "pb_bio_dek_v1";
    private static final int STRONG = BiometricManager.Authenticators.BIOMETRIC_STRONG;

    private SecretKey bioKey(boolean createFresh) throws Exception {
        KeyStore ks = KeyStore.getInstance(KS);
        ks.load(null);
        if (createFresh && ks.containsAlias(ALIAS)) ks.deleteEntry(ALIAS);
        if (ks.containsAlias(ALIAS)) return (SecretKey) ks.getKey(ALIAS, null);
        KeyGenerator kg = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, KS);
        KeyGenParameterSpec.Builder b = new KeyGenParameterSpec.Builder(ALIAS,
            KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
            .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
            .setKeySize(256)
            .setUserAuthenticationRequired(true)
            .setInvalidatedByBiometricEnrollment(true);
        if (Build.VERSION.SDK_INT >= 30) b.setUserAuthenticationParameters(0, KeyProperties.AUTH_BIOMETRIC_STRONG);
        kg.init(b.build());
        return kg.generateKey();
    }

    @PluginMethod
    public void biometricAvailable(PluginCall call) {
        int res = BiometricManager.from(getContext()).canAuthenticate(STRONG);
        JSObject ret = new JSObject();
        ret.put("available", res == BiometricManager.BIOMETRIC_SUCCESS);
        call.resolve(ret);
    }

    private void prompt(final PluginCall call, final Cipher cipher, final String title, final java.util.function.Consumer<Cipher> done) {
        final FragmentActivity act = getActivity();
        act.runOnUiThread(() -> {
            try {
                BiometricPrompt p = new BiometricPrompt(act, ContextCompat.getMainExecutor(act),
                    new BiometricPrompt.AuthenticationCallback() {
                        @Override
                        public void onAuthenticationSucceeded(BiometricPrompt.AuthenticationResult r) {
                            try { done.accept(r.getCryptoObject().getCipher()); }
                            catch (Exception e) { call.reject("Biometric failed: " + e.getMessage()); }
                        }
                        @Override
                        public void onAuthenticationError(int code, CharSequence msg) { call.reject(String.valueOf(msg)); }
                    });
                BiometricPrompt.PromptInfo info = new BiometricPrompt.PromptInfo.Builder()
                    .setTitle(title)
                    .setNegativeButtonText("Use PIN")
                    .setAllowedAuthenticators(STRONG)
                    .build();
                p.authenticate(info, new BiometricPrompt.CryptoObject(cipher));
            } catch (Exception e) {
                call.reject("Biometric failed: " + e.getMessage());
            }
        });
    }

    /** Seal the data key with a fresh fingerprint-bound key. Returns base64(iv + ciphertext). */
    @PluginMethod
    public void biometricEnroll(final PluginCall call) {
        final String dek = call.getString("dek");
        if (dek == null) { call.reject("dek required"); return; }
        try {
            final Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
            c.init(Cipher.ENCRYPT_MODE, bioKey(true));
            prompt(call, c, "Confirm fingerprint", (cipher) -> {
                try {
                    byte[] ct = cipher.doFinal(Base64.decode(dek, Base64.NO_WRAP));
                    byte[] iv = cipher.getIV();
                    byte[] out = new byte[iv.length + ct.length];
                    System.arraycopy(iv, 0, out, 0, iv.length);
                    System.arraycopy(ct, 0, out, iv.length, ct.length);
                    JSObject r = new JSObject();
                    r.put("blob", Base64.encodeToString(out, Base64.NO_WRAP));
                    call.resolve(r);
                } catch (Exception e) { call.reject("Seal failed: " + e.getMessage()); }
            });
        } catch (Exception e) {
            call.reject("Biometric failed: " + e.getMessage());
        }
    }

    /** Fingerprint → release the data key. */
    @PluginMethod
    public void biometricUnlock(final PluginCall call) {
        final String blob = call.getString("blob");
        if (blob == null) { call.reject("blob required"); return; }
        try {
            final byte[] all = Base64.decode(blob, Base64.NO_WRAP);
            final Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
            c.init(Cipher.DECRYPT_MODE, bioKey(false), new GCMParameterSpec(128, all, 0, 12));
            prompt(call, c, "Unlock PhoneBook", (cipher) -> {
                try {
                    byte[] raw = cipher.doFinal(all, 12, all.length - 12);
                    JSObject r = new JSObject();
                    r.put("dek", Base64.encodeToString(raw, Base64.NO_WRAP));
                    call.resolve(r);
                } catch (Exception e) { call.reject("Unseal failed: " + e.getMessage()); }
            });
        } catch (KeyPermanentlyInvalidatedException e) {
            deleteBioKey();
            call.reject("invalidated");
        } catch (Exception e) {
            call.reject("Biometric failed: " + e.getMessage());
        }
    }

    private void deleteBioKey() {
        try { KeyStore ks = KeyStore.getInstance(KS); ks.load(null); if (ks.containsAlias(ALIAS)) ks.deleteEntry(ALIAS); } catch (Exception ignored) { }
    }

    @PluginMethod
    public void biometricReset(PluginCall call) {
        deleteBioKey();
        call.resolve();
    }

    // ---------- screen security ----------
    @PluginMethod
    public void setSecure(PluginCall call) {
        final boolean on = Boolean.TRUE.equals(call.getBoolean("enabled", true));
        getActivity().runOnUiThread(() -> {
            if (on) getActivity().getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE);
            else getActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
            call.resolve();
        });
    }
}
