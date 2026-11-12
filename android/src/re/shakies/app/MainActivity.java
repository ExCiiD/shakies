package re.shakies.app;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

/** Shakies : l'app web embarquée (assets/www) dans une WebView, avec un pont natif pour le partage. */
public class MainActivity extends Activity {
    // Version en ligne (mise à jour sans réinstaller l'APK) ; la copie embarquée sert de secours hors-ligne
    private static final String REMOTE = "https://exciid.github.io/shakies/index.html";
    private static final String HOST = "exciid.github.io";
    private static final String LOCAL = "file:///android_asset/www/index.html";
    private boolean usingLocal = false;
    private WebView web;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(0xFFFFF8F1);
        getWindow().setNavigationBarColor(0xFFFFFFFF);
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);

        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // localStorage : favoris, recettes perso, courses
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(true);            // nécessaire pour file:///android_asset
        s.setTextZoom(100);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.addJavascriptInterface(new Bridge(), "Android");
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                Uri u = req.getUrl();
                if ("file".equals(u.getScheme()) || HOST.equals(u.getHost())) return false;
                openExternal(u);                 // liens externes : navigateur / appli dédiée
                return true;
            }
            @Override
            public void onReceivedError(WebView view, WebResourceRequest req, android.webkit.WebResourceError err) {
                // pas de réseau et rien en cache : on bascule sur la version embarquée
                if (req.isForMainFrame() && !usingLocal) { usingLocal = true; view.loadUrl(LOCAL); }
            }
        });
        setContentView(web);
        if (savedInstanceState != null) web.restoreState(savedInstanceState);
        else web.loadUrl(REMOTE);
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        web.evaluateJavascript("window.appBack ? window.appBack() : false", new ValueCallback<String>() {
            @Override public void onReceiveValue(String v) { if (!"true".equals(v)) finish(); }
        });
    }

    private void openExternal(Uri u) {
        try {
            Intent i = new Intent(Intent.ACTION_VIEW, u);
            if ("mailto".equals(u.getScheme()) || "sms".equals(u.getScheme())) i = new Intent(Intent.ACTION_SENDTO, u);
            startActivity(i);
        } catch (ActivityNotFoundException ignored) { }
    }

    private Intent textIntent(String text) {
        Intent i = new Intent(Intent.ACTION_SEND);
        i.setType("text/plain");
        i.putExtra(Intent.EXTRA_SUBJECT, "Courses Shakies");
        i.putExtra(Intent.EXTRA_TEXT, text);
        return i;
    }

    /** Méthodes appelées depuis le JavaScript via window.Android */
    private class Bridge {
        @JavascriptInterface
        public void share(final String text) {
            runOnUiThread(new Runnable() { @Override public void run() {
                startActivity(Intent.createChooser(textIntent(text), "Partager la liste"));
            }});
        }

        @JavascriptInterface
        public void shareTo(final String pkg, final String text) {
            runOnUiThread(new Runnable() { @Override public void run() {
                Intent i = textIntent(text);
                i.setPackage(pkg);
                try { startActivity(i); }
                catch (ActivityNotFoundException e) {   // appli pas installée : choix libre
                    startActivity(Intent.createChooser(textIntent(text), "Partager la liste"));
                }
            }});
        }

        @JavascriptInterface
        public void openUrl(final String url) {
            runOnUiThread(new Runnable() { @Override public void run() { openExternal(Uri.parse(url)); }});
        }

        @JavascriptInterface
        public void copy(String text) {
            ClipboardManager cm = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
            cm.setPrimaryClip(ClipData.newPlainText("Courses Shakies", text));
        }

        @JavascriptInterface
        public String saveText(String name, String text) {
            byte[] data = text.getBytes(StandardCharsets.UTF_8);
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ContentValues v = new ContentValues();
                    v.put(MediaStore.Downloads.DISPLAY_NAME, name);
                    v.put(MediaStore.Downloads.MIME_TYPE, "text/plain");
                    Uri uri = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, v);
                    try (OutputStream os = getContentResolver().openOutputStream(uri)) { os.write(data); }
                    return "💾 " + name + " enregistré dans Téléchargements.";
                } else {
                    File dir = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                    File f = new File(dir, name);
                    try (FileOutputStream os = new FileOutputStream(f)) { os.write(data); }
                    return "💾 Enregistré : " + f.getAbsolutePath();
                }
            } catch (Exception e) {
                return "Enregistrement impossible : utilise « Partager » ou « Copier ».";
            }
        }
    }
}
