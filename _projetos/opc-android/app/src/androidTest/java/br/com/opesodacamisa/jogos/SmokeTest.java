package br.com.opesodacamisa.jogos;
import android.app.Instrumentation;
import android.webkit.WebView;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.rule.ActivityTestRule;
import org.junit.*;
import org.junit.runner.RunWith;
import java.util.concurrent.*;
import static org.junit.Assert.*;
@RunWith(AndroidJUnit4.class)
public class SmokeTest {
 @Rule public ActivityTestRule<MainActivity> rule=new ActivityTestRule<>(MainActivity.class);
 private String js(String code)throws Exception{CountDownLatch latch=new CountDownLatch(1);String[] result={null};rule.getActivity().runOnUiThread(()->rule.getActivity().web.evaluateJavascript(code,value->{result[0]=value;latch.countDown();}));assertTrue("JS callback",latch.await(15,TimeUnit.SECONDS));return result[0];}
 private void ready()throws Exception{long deadline=System.currentTimeMillis()+30000;while(System.currentTimeMillis()<deadline){if("true".equals(js("!!window.OPC_APP && document.readyState==='complete'")))return;Thread.sleep(200);}fail("Page did not initialize");}
 @Test public void allGamesOpenFromLocalAssetsAndFitPhone()throws Exception{
  ready();long deadline=System.currentTimeMillis()+15000;while(!"8".equals(js("document.querySelectorAll('.app-game').length"))&&System.currentTimeMillis()<deadline)Thread.sleep(200);
  assertEquals("8",js("document.querySelectorAll('.app-game').length"));
  assertEquals("true",js("document.documentElement.scrollWidth<=innerWidth"));
  js("document.querySelector('.favorite-toggle').click()");js("document.querySelector('[data-filter=favorites]').click()");assertEquals("1",js("document.querySelectorAll('.app-game').length"));
  rule.getActivity().runOnUiThread(()->rule.getActivity().web.getSettings().setBlockNetworkLoads(true));
  String[] pages={"jogo-da-velha.html","futdraw.html","adivinhe-pela-carreira.html","intruso-da-camisa.html","escalacao-historica.html","desafio-das-lendas.html","desafio-da-champions.html","forja-de-craques/index.html"};
  for(String page:pages){rule.getActivity().runOnUiThread(()->rule.getActivity().web.loadUrl(MainActivity.ORIGIN+"/assets/www/"+page));Thread.sleep(300);ready();assertEquals(page,"true",js("document.documentElement.classList.contains('opc-mobile')"));assertEquals(page,"true",js("document.documentElement.scrollWidth<=innerWidth+1"));assertEquals(page,"1",js("document.querySelectorAll('.opc-app-bar').length"));}
 }
 @Test public void futdrawTrainingAndAndroidBack()throws Exception{
  rule.getActivity().runOnUiThread(()->rule.getActivity().web.loadUrl(MainActivity.ORIGIN+"/assets/www/futdraw.html"));Thread.sleep(300);ready();
  js("document.getElementById('fd-practice').click()");long deadline=System.currentTimeMillis()+15000;while(!"3".equals(js("document.querySelectorAll('#fd-choices button').length"))&&System.currentTimeMillis()<deadline)Thread.sleep(100);assertEquals("3",js("document.querySelectorAll('#fd-choices button').length"));
  js("document.querySelector('#fd-choices button').click()");assertEquals("false",js("document.getElementById('fd-tools').hidden"));assertEquals("false",js("document.getElementById('fd-next').hidden"));
  js("window.OPC_APP.back()");assertEquals("true",js("document.getElementById('fd-confirm').open"));js("document.getElementById('fd-confirm-no').click()");assertEquals("false",js("document.getElementById('fd-room').hidden"));
 }
 @Test public void pngExportUsesAndroidDocumentPickerAndPublicInvites()throws Exception{
  rule.getActivity().runOnUiThread(()->rule.getActivity().web.loadUrl(MainActivity.ORIGIN+"/assets/www/futdraw.html"));Thread.sleep(300);ready();
  js("document.getElementById('fd-practice').click()");long deadline=System.currentTimeMillis()+15000;while(!"3".equals(js("document.querySelectorAll('#fd-choices button').length"))&&System.currentTimeMillis()<deadline)Thread.sleep(100);js("document.querySelector('#fd-choices button').click()");
  java.io.File png=new java.io.File(rule.getActivity().getCacheDir(),"export-test.png");if(png.exists())assertTrue(png.delete());
  Instrumentation instrumentation=InstrumentationRegistry.getInstrumentation();
  Instrumentation.ActivityMonitor picker=new Instrumentation.ActivityMonitor(){@Override public Instrumentation.ActivityResult onStartActivity(android.content.Intent intent){if(android.content.Intent.ACTION_CREATE_DOCUMENT.equals(intent.getAction()))return new Instrumentation.ActivityResult(android.app.Activity.RESULT_OK,new android.content.Intent().setData(android.net.Uri.fromFile(png)));return null;}};
  instrumentation.addMonitor(picker);try{js("document.getElementById('fd-save').click()");deadline=System.currentTimeMillis()+15000;while(!png.exists()&&System.currentTimeMillis()<deadline)Thread.sleep(100);assertTrue("PNG saved through native document picker",png.exists());android.graphics.Bitmap bitmap=android.graphics.BitmapFactory.decodeFile(png.getPath());assertNotNull(bitmap);assertEquals(960,bitmap.getWidth());assertEquals(600,bitmap.getHeight());bitmap.recycle();}finally{instrumentation.removeMonitor(picker);}
  js("navigator.clipboard.writeText(location.origin+'/assets/www/futdraw.html?sala=ABC123')");Thread.sleep(200);
  android.content.ClipboardManager clipboard=(android.content.ClipboardManager)rule.getActivity().getSystemService(android.content.Context.CLIPBOARD_SERVICE);assertEquals("https://dacamisaopeso-art.github.io/o-peso-da-camisa/futdraw.html?sala=ABC123",clipboard.getPrimaryClip().getItemAt(0).getText().toString());
 }

}