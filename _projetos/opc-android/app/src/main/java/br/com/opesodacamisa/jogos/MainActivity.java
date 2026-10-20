package br.com.opesodacamisa.jogos;

import android.app.*;
import android.os.*;
import android.content.*;
import android.content.pm.ApplicationInfo;
import android.graphics.Color;
import android.net.Uri;
import android.view.*;
import android.webkit.*;
import android.widget.*;
import androidx.webkit.*;
import org.json.JSONObject;
import java.io.*;
import java.util.Collections;

public class MainActivity extends Activity {
    static final String ORIGIN="https://appassets.androidplatform.net";
    static final String HOME=ORIGIN+"/assets/www/index.html";
    WebView web;
    private FrameLayout root;
    private View fullView;
    private WebChromeClient.CustomViewCallback fullCallback;
    private byte[] pendingPng;
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        if(Build.VERSION.SDK_INT>=30)getWindow().setDecorFitsSystemWindows(false);
        root=new FrameLayout(this);root.setBackgroundColor(Color.rgb(11,14,17));setContentView(root);
        root.setOnApplyWindowInsetsListener((view,insets)->{
            if(Build.VERSION.SDK_INT>=30){android.graphics.Insets bars=insets.getInsets(WindowInsets.Type.systemBars()|WindowInsets.Type.displayCutout()|WindowInsets.Type.ime());view.setPadding(bars.left,bars.top,bars.right,bars.bottom);}
            return insets;
        });
        android.content.pm.PackageInfo provider=WebView.getCurrentWebViewPackage();
        int major=0;try{if(provider!=null)major=Integer.parseInt(provider.versionName.split("\\.")[0]);}catch(Exception ignored){}
        if(major<111){new AlertDialog.Builder(this).setTitle("Atualize o componente de navegação").setMessage("Para abrir os jogos com segurança, atualize o Android System WebView ou o Chrome e abra o OPC Jogos novamente.").setCancelable(false).setNegativeButton("Fechar",(d,w)->finish()).setPositiveButton("Ver atualização",(d,w)->{openBrowser(Uri.parse("https://play.google.com/store/apps/details?id=com.google.android.webview"));finish();}).show();return;}
        web=new WebView(this);root.addView(web,new FrameLayout.LayoutParams(-1,-1));web.setBackgroundColor(Color.rgb(11,14,17));
        WebSettings settings=web.getSettings();settings.setJavaScriptEnabled(true);settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);settings.setAllowContentAccess(false);settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);settings.setSupportMultipleWindows(false);settings.setMediaPlaybackRequiresUserGesture(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(web,false);
        WebView.setWebContentsDebuggingEnabled((getApplicationInfo().flags&ApplicationInfo.FLAG_DEBUGGABLE)!=0);
        WebViewAssetLoader loader=new WebViewAssetLoader.Builder().addPathHandler("/assets/",new WebViewAssetLoader.AssetsPathHandler(this)).build();
        web.setWebViewClient(new WebViewClient(){
            @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){return loader.shouldInterceptRequest(request.getUrl());}
            @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){
                Uri u=request.getUrl();if(ORIGIN.equals(u.getScheme()+"://"+u.getAuthority())&&u.getPath()!=null&&u.getPath().startsWith("/assets/www/"))return false;
                if(request.isForMainFrame()&&"https".equals(u.getScheme()))new AlertDialog.Builder(MainActivity.this).setTitle("Abrir fora do aplicativo?").setMessage("Este link será aberto no navegador.").setNegativeButton("Cancelar",null).setPositiveButton("Abrir",(d,w)->openBrowser(u)).show();
                return true;
            }
            @Override public void onReceivedError(WebView view,WebResourceRequest req,WebResourceError error){if(req.isForMainFrame())toast("Não foi possível abrir o jogo. Volte para a central e tente novamente.");}
            @Override public boolean onRenderProcessGone(WebView view,RenderProcessGoneDetail detail){view.destroy();recreate();return true;}
        });
        web.setWebChromeClient(new WebChromeClient(){
            @Override public void onShowCustomView(View view,CustomViewCallback callback){if(fullView!=null){callback.onCustomViewHidden();return;}fullView=view;fullCallback=callback;root.addView(view,new FrameLayout.LayoutParams(-1,-1));web.setVisibility(View.GONE);if(Build.VERSION.SDK_INT>=30){getWindow().getInsetsController().hide(WindowInsets.Type.systemBars());getWindow().getInsetsController().setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);}}
            @Override public void onHideCustomView(){exitFull();}
            @Override public boolean onJsAlert(WebView v,String url,String text,JsResult result){new AlertDialog.Builder(MainActivity.this).setMessage(text).setPositiveButton("OK",(d,w)->result.confirm()).setOnCancelListener(d->result.cancel()).show();return true;}
            @Override public boolean onJsConfirm(WebView v,String url,String text,JsResult result){new AlertDialog.Builder(MainActivity.this).setMessage(text).setPositiveButton("Confirmar",(d,w)->result.confirm()).setNegativeButton("Cancelar",(d,w)->result.cancel()).setOnCancelListener(d->result.cancel()).show();return true;}
        });
        if(WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER))WebViewCompat.addWebMessageListener(web,"OPCNative",Collections.singleton(ORIGIN),(view,message,origin,main,reply)->{
            if(!main||!ORIGIN.equals(origin.toString()))return;
            String raw=message.getData();if(raw==null||raw.length()>8_000_000)return;
            try{JSONObject obj=new JSONObject(raw);String type=obj.optString("type"),id=obj.optString("id");
                if("savePng".equals(type)){savePng(obj.optString("data"),obj.optString("name"));}
                else if("share".equals(type)){String text=obj.optString("text"),url=obj.optString("url");if(text.length()>4000||url.length()>1000)return;Uri u=Uri.parse(url);if(!url.isEmpty()&&!("https".equals(u.getScheme())&&"dacamisaopeso-art.github.io".equals(u.getHost())))return;Intent send=new Intent(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT,text+(url.isEmpty()?"":"\n"+url));startActivity(Intent.createChooser(send,"Compartilhar"));}
                else if("copy".equals(type)){String text=obj.optString("text");if(text.length()>8000)return;((android.content.ClipboardManager)getSystemService(CLIPBOARD_SERVICE)).setPrimaryClip(ClipData.newPlainText("OPC Jogos",text));toast("Copiado.");}
                else if("exit".equals(type)){new AlertDialog.Builder(this).setTitle("Fechar OPC Jogos?").setNegativeButton("Continuar jogando",null).setPositiveButton("Fechar",(d,w)->finish()).show();}
                reply.postMessage(new JSONObject().put("id",id).put("ok",true).toString());
            }catch(Exception e){toast("Não foi possível concluir. Tente novamente.");}
        });
        if(Build.VERSION.SDK_INT>=33)getOnBackInvokedDispatcher().registerOnBackInvokedCallback(android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT,this::appBack);
        if(state==null||web.restoreState(state)==null)web.loadUrl(HOME);
    }
    private void openBrowser(Uri uri){try{startActivity(new Intent(Intent.ACTION_VIEW,uri));}catch(ActivityNotFoundException e){toast("Nenhum navegador disponível.");}}
    private void toast(String text){Toast.makeText(this,text,Toast.LENGTH_LONG).show();}
    private void savePng(String data,String name)throws Exception{
        if(pendingPng!=null){toast("Conclua o salvamento anterior primeiro.");return;}
        if(!data.startsWith("data:image/png;base64,"))return;byte[] png=android.util.Base64.decode(data.substring(22),android.util.Base64.DEFAULT);
        if(png.length<8||png.length>6_000_000||png[0]!=(byte)137||png[1]!=80||png[2]!=78||png[3]!=71)return;
        pendingPng=png;Intent save=new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("image/png");save.putExtra(Intent.EXTRA_TITLE,name.replaceAll("[^a-zA-Z0-9_.-]","-").replaceAll("^\\.+","")+".png");startActivityForResult(save,42);
    }
    @Override protected void onActivityResult(int request,int result,Intent data){super.onActivityResult(request,result,data);if(request!=42)return;byte[] png=pendingPng;pendingPng=null;if(result!=RESULT_OK||data==null||data.getData()==null||png==null)return;try(OutputStream out=getContentResolver().openOutputStream(data.getData())){if(out==null)throw new IOException();out.write(png);toast("Desenho salvo.");}catch(IOException e){toast("Não foi possível salvar o desenho.");}}
    void appBack(){if(web==null){finish();return;}if(fullView!=null){exitFull();return;}web.evaluateJavascript("window.OPC_APP ? window.OPC_APP.back() : history.back()",null);}
    @Override public void onBackPressed(){appBack();}
    private void exitFull(){if(fullView==null)return;root.removeView(fullView);fullView=null;web.setVisibility(View.VISIBLE);if(fullCallback!=null){fullCallback.onCustomViewHidden();fullCallback=null;}if(Build.VERSION.SDK_INT>=30)getWindow().getInsetsController().show(WindowInsets.Type.systemBars());}
    @Override protected void onSaveInstanceState(Bundle state){if(web!=null)web.saveState(state);super.onSaveInstanceState(state);}
    @Override protected void onPause(){super.onPause();if(web!=null)web.onPause();}
    @Override protected void onResume(){super.onResume();if(web!=null)web.onResume();}
    @Override protected void onDestroy(){if(web!=null){root.removeView(web);web.destroy();}super.onDestroy();}
}
