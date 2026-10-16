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
    private static final int AUTHENTICATORS =
        BiometricManager.Authenticators.BIOMETRIC_STRONG | BiometricManager.Authenticators.BIOMETRIC_WEAK;

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

    // ---------- biometrics ----------
    @PluginMethod
    public void biometricAvailable(PluginCall call) {
        int res = BiometricManager.from(getContext()).canAuthenticate(AUTHENTICATORS);
        JSObject ret = new JSObject();
        ret.put("available", res == BiometricManager.BIOMETRIC_SUCCESS);
        call.resolve(ret);
    }

    @PluginMethod
    public void biometricAuth(final PluginCall call) {
        final FragmentActivity act = getActivity();
        getActivity().runOnUiThread(() -> {
            try {
                BiometricPrompt prompt = new BiometricPrompt(act, ContextCompat.getMainExecutor(act),
                    new BiometricPrompt.AuthenticationCallback() {
                        @Override
                        public void onAuthenticationSucceeded(BiometricPrompt.AuthenticationResult result) {
                            call.resolve();
                        }
                        @Override
                        public void onAuthenticationError(int code, CharSequence msg) {
                            call.reject(String.valueOf(msg));
                        }
                    });
                BiometricPrompt.PromptInfo info = new BiometricPrompt.PromptInfo.Builder()
                    .setTitle(call.getString("title", "Unlock PhoneBook"))
                    .setNegativeButtonText("Use PIN")
                    .setAllowedAuthenticators(AUTHENTICATORS)
                    .build();
                prompt.authenticate(info);
            } catch (Exception e) {
                call.reject("Biometric failed: " + e.getMessage());
            }
        });
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
