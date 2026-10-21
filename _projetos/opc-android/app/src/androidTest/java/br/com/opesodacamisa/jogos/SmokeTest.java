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
 private String expectedUrl="";
 private void load(String page)throws Exception{expectedUrl=MainActivity.ORIGIN+"/assets/www/"+page+(page.contains("?")?"&":"?")+"qa="+System.nanoTime();rule.getActivity().runOnUiThread(()->rule.getActivity().web.loadUrl(expectedUrl));ready();}
 private void ready()throws Exception{long deadline=System.currentTimeMillis()+30000;while(System.currentTimeMillis()<deadline){if("true".equals(js("!!window.OPC_APP && document.readyState==='complete' && (!"+org.json.JSONObject.quote(expectedUrl)+" || location.href==="+org.json.JSONObject.quote(expectedUrl)+")")))return;Thread.sleep(200);}fail("Page did not initialize");}
 @Test public void allGamesOpenFromLocalAssetsAndFitPhone()throws Exception{
  load("index.html");long deadline=System.currentTimeMillis()+15000;while(!"8".equals(js("document.querySelectorAll('.app-game').length"))&&System.currentTimeMillis()<deadline)Thread.sleep(200);
  assertEquals("8",js("document.querySelectorAll('.app-game').length"));
  assertEquals("true",js("document.documentElement.scrollWidth<=innerWidth"));
  js("document.querySelector('.app-game .favorite-toggle').click()");js("document.querySelector('[data-filter=favorites]').click()");assertEquals("1",js("document.querySelectorAll('.app-game').length"));
  rule.getActivity().runOnUiThread(()->rule.getActivity().web.getSettings().setBlockNetworkLoads(true));
  String[] pages={"jogo-da-velha.html","futdraw.html","adivinhe-pela-carreira.html","intruso-da-camisa.html","escalacao-historica.html","desafio-das-lendas.html","desafio-da-champions.html","forja-de-craques/index.html"};
  for(String page:pages){load(page);assertEquals(page,"true",js("document.documentElement.classList.contains('opc-mobile')"));assertEquals(page,"true",js("document.documentElement.scrollWidth<=innerWidth+1"));assertEquals(page,"1",js("document.querySelectorAll('.opc-app-bar').length"));}
 }
 @Test public void dailyChallengeResumesAndReportStaysLocal()throws Exception{
  load("intruso-da-camisa.html?dia=2026-10-20");
  assertEquals("false",js("document.getElementById('play').hidden"));
  js("document.getElementById('pass').click();document.getElementById('next').click()");
  assertEquals("true",js("document.getElementById('round').textContent.includes('2 / 10')"));
  load("intruso-da-camisa.html?dia=2026-10-20");
  assertEquals("true",js("document.getElementById('round').textContent.includes('2 / 10')"));
  js("Array.from(document.querySelectorAll('.opc-tools button')).find(b=>b.textContent==='Reportar problema').click()");
  assertEquals("true",js("document.getElementById('opc-report').open"));
  rule.getActivity().runOnUiThread(()->rule.getActivity().appBack());
  Thread.sleep(300);
  assertEquals("false",js("document.getElementById('opc-report').open"));
 }
 @Test public void futdrawTrainingAndAndroidBack()throws Exception{
  load("futdraw.html");
  js("document.getElementById('fd-practice').click()");long deadline=System.currentTimeMillis()+15000;while(!"3".equals(js("document.querySelectorAll('#fd-choices button').length"))&&System.currentTimeMillis()<deadline)Thread.sleep(100);assertEquals("3",js("document.querySelectorAll('#fd-choices button').length"));
  js("document.querySelector('#fd-choices button').click()");assertEquals("false",js("document.getElementById('fd-tools').hidden"));assertEquals("false",js("document.getElementById('fd-next').hidden"));
  js("window.OPC_APP.back()");assertEquals("true",js("document.getElementById('fd-confirm').open"));js("document.getElementById('fd-confirm-no').click()");assertEquals("false",js("document.getElementById('fd-room').hidden"));
 }
 @Test public void pngExportUsesAndroidDocumentPickerAndPublicInvites()throws Exception{
  load("futdraw.html");
  js("document.getElementById('fd-practice').click()");long deadline=System.currentTimeMillis()+15000;while(!"3".equals(js("document.querySelectorAll('#fd-choices button').length"))&&System.currentTimeMillis()<deadline)Thread.sleep(100);assertEquals("3",js("document.querySelectorAll('#fd-choices button').length"));js("document.querySelector('#fd-choices button').click()");
  org.json.JSONArray position=new org.json.JSONArray(js("(()=>{const c=document.getElementById('fd-canvas');c.scrollIntoView({block:'center',behavior:'instant'});const r=c.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2,devicePixelRatio];})()"));
  int[] offset=new int[2];Instrumentation touch=InstrumentationRegistry.getInstrumentation();touch.runOnMainSync(()->rule.getActivity().web.getLocationOnScreen(offset));float x=(float)(offset[0]+position.getDouble(0)*position.getDouble(2)),y=(float)(offset[1]+position.getDouble(1)*position.getDouble(2));long time=android.os.SystemClock.uptimeMillis();android.view.MotionEvent down=android.view.MotionEvent.obtain(time,time,android.view.MotionEvent.ACTION_DOWN,x,y,0),up=android.view.MotionEvent.obtain(time,time+60,android.view.MotionEvent.ACTION_UP,x,y,0);down.setSource(android.view.InputDevice.SOURCE_TOUCHSCREEN);up.setSource(android.view.InputDevice.SOURCE_TOUCHSCREEN);touch.sendPointerSync(down);touch.sendPointerSync(up);down.recycle();up.recycle();Thread.sleep(200);
  rule.getActivity().runOnUiThread(()->rule.getActivity().setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE));deadline=System.currentTimeMillis()+10000;while(!"true".equals(js("innerWidth>innerHeight"))&&System.currentTimeMillis()<deadline)Thread.sleep(100);assertEquals("true",js("innerWidth>innerHeight"));
  java.io.File png=new java.io.File(rule.getActivity().getCacheDir(),"export-test.png");if(png.exists())assertTrue(png.delete());
  Instrumentation instrumentation=InstrumentationRegistry.getInstrumentation();
  Instrumentation.ActivityMonitor picker=new Instrumentation.ActivityMonitor(){@Override public Instrumentation.ActivityResult onStartActivity(android.content.Intent intent){if(android.content.Intent.ACTION_CREATE_DOCUMENT.equals(intent.getAction()))return new Instrumentation.ActivityResult(android.app.Activity.RESULT_OK,new android.content.Intent().setData(android.net.Uri.fromFile(png)));return null;}};
  instrumentation.addMonitor(picker);try{js("document.getElementById('fd-save').click()");deadline=System.currentTimeMillis()+15000;while(!png.exists()&&System.currentTimeMillis()<deadline)Thread.sleep(100);assertTrue("PNG saved through native document picker",png.exists());android.graphics.Bitmap bitmap=android.graphics.BitmapFactory.decodeFile(png.getPath());assertNotNull(bitmap);assertEquals(960,bitmap.getWidth());assertEquals(600,bitmap.getHeight());assertNotEquals("Touch drawing survives rotation",android.graphics.Color.WHITE,bitmap.getPixel(480,300));bitmap.recycle();assertTrue(png.delete());js("(()=>{const c=document.createElement('canvas');c.width=24;c.height=20;c.toBlob(blob=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='forja-teste.png';a.click();});})()");deadline=System.currentTimeMillis()+15000;while(!png.exists()&&System.currentTimeMillis()<deadline)Thread.sleep(100);assertTrue("Card PNG downloads use the Android picker too",png.exists());}finally{instrumentation.removeMonitor(picker);}
  js("navigator.clipboard.writeText(location.origin+'/assets/www/futdraw.html?sala=ABC123')");Thread.sleep(200);
  android.content.ClipboardManager clipboard=(android.content.ClipboardManager)rule.getActivity().getSystemService(android.content.Context.CLIPBOARD_SERVICE);assertEquals("https://dacamisaopeso-art.github.io/o-peso-da-camisa/futdraw.html?sala=ABC123",clipboard.getPrimaryClip().getItemAt(0).getText().toString());
 }

 @Test public void onlineRoomConnectsFromAndroidOriginAndLeavesCleanly()throws Exception{
  load("futdraw.html");
  js("document.getElementById('fd-name').value='Android QA';document.getElementById('fd-rounds').value='10';document.getElementById('fd-setup').requestSubmit()");
  try{long deadline=System.currentTimeMillis()+30000;while(!"false".equals(js("document.getElementById('fd-room').hidden"))&&System.currentTimeMillis()<deadline)Thread.sleep(200);assertEquals("Room connects from local Android HTTPS origin","false",js("document.getElementById('fd-room').hidden"));assertEquals("true",js("document.getElementById('fd-lobby-info').textContent.includes('10 rodada')"));}
  finally{js("document.getElementById('fd-leave').click()");Thread.sleep(200);js("if(document.getElementById('fd-confirm').open)document.getElementById('fd-confirm-yes').click()");}
 }

}
