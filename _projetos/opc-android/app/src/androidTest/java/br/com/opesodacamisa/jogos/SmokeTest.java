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
  load("index.html");long deadline=System.currentTimeMillis()+15000;while(!"9".equals(js("document.querySelectorAll('.app-game').length"))&&System.currentTimeMillis()<deadline)Thread.sleep(200);
  assertEquals("9",js("document.querySelectorAll('.app-game').length"));
  assertEquals("true",js("document.documentElement.scrollWidth<=innerWidth"));
  js("document.querySelector('.app-game .favorite-toggle').click()");js("document.querySelector('[data-filter=favorites]').click()");assertEquals("1",js("document.querySelectorAll('.app-game').length"));
  rule.getActivity().runOnUiThread(()->rule.getActivity().web.getSettings().setBlockNetworkLoads(true));
  String[] pages={"drafteam.html","jogo-da-velha.html","futdraw.html","adivinhe-pela-carreira.html","intruso-da-camisa.html","escalacao-historica.html","desafio-das-lendas.html","desafio-da-champions.html","forja-de-craques/index.html"};
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

 @Test public void preferencesPersistAndBackClosesTopHelp()throws Exception{
  load("jogo-da-velha.html");
  js("OPC_OPEN_PREFS()");
  assertEquals("true",js("document.querySelector('dialog.opc-report').open"));
  js("(()=>{const d=document.querySelector('dialog.opc-report');d.querySelector('select').value='extra';d.querySelectorAll('input')[0].checked=true;d.querySelector('form').requestSubmit();})()");
  assertEquals("true",js("document.documentElement.dataset.opcText==='extra'&&document.documentElement.classList.contains('opc-reduce-motion')"));
  js("OPC_OPEN_RULES({id:'velha'})");
  rule.getActivity().runOnUiThread(()->rule.getActivity().appBack());Thread.sleep(200);
  assertEquals("1",js("document.querySelectorAll('dialog[open]').length"));
  js("document.querySelector('dialog[open]').close()");
  load("futdraw.html");
  assertEquals("extra",new org.json.JSONArray("["+js("document.documentElement.dataset.opcText")+"]").getString(0));
  assertEquals("true",js("document.documentElement.scrollWidth<=innerWidth+1"));
  js("OPC_PREFS.save({text:'normal',reduceMotion:false,saveData:false})");
 }

 @Test public void backupExportAndImportUseAndroidPicker()throws Exception{
  load("index.html");js("localStorage.setItem('opc-app-favorites',JSON.stringify(['velha']));localStorage.setItem('opc-futdraw-recovery-v1',JSON.stringify({token:'not-exportable'}));OPC_OPEN_BACKUP()");
  java.io.File backup=new java.io.File(rule.getActivity().getCacheDir(),"opc-backup-test.json");if(backup.exists())assertTrue(backup.delete());
  Instrumentation instrumentation=InstrumentationRegistry.getInstrumentation();
  Instrumentation.ActivityMonitor picker=new Instrumentation.ActivityMonitor(){@Override public Instrumentation.ActivityResult onStartActivity(android.content.Intent intent){if(android.content.Intent.ACTION_CREATE_DOCUMENT.equals(intent.getAction())||android.content.Intent.ACTION_OPEN_DOCUMENT.equals(intent.getAction()))return new Instrumentation.ActivityResult(android.app.Activity.RESULT_OK,new android.content.Intent().setData(android.net.Uri.fromFile(backup)));return null;}};
  instrumentation.addMonitor(picker);
  try{js("Array.from(document.querySelectorAll('dialog button')).find(b=>b.textContent==='Exportar backup').click()");long deadline=System.currentTimeMillis()+15000;while(!backup.exists()&&System.currentTimeMillis()<deadline)Thread.sleep(100);assertTrue(backup.exists());String text=new String(java.nio.file.Files.readAllBytes(backup.toPath()),java.nio.charset.StandardCharsets.UTF_8);assertTrue(text.contains("opc-jogos-backup"));assertFalse(text.contains("not-exportable"));
   js("localStorage.setItem('opc-app-favorites','[]');Array.from(document.querySelectorAll('dialog button')).find(b=>b.textContent==='Escolher backup para importar').click()");deadline=System.currentTimeMillis()+15000;while(!"true".equals(js("Array.from(document.querySelectorAll('dialog button')).some(b=>b.textContent==='Confirmar importação'&&!b.hidden)"))&&System.currentTimeMillis()<deadline)Thread.sleep(100);
   js("Array.from(document.querySelectorAll('dialog button')).find(b=>b.textContent==='Confirmar importação').click()");Thread.sleep(500);ready();assertEquals("true",js("JSON.parse(localStorage.getItem('opc-app-favorites')).includes('velha')"));
  }finally{instrumentation.removeMonitor(picker);backup.delete();js("localStorage.removeItem('opc-futdraw-recovery-v1')");}
 }
 @Test public void tutorialIsSkippableAndDoesNotRepeat()throws Exception{
  load("index.html");js("localStorage.removeItem('opc-tutorial-v1-futdraw')");load("futdraw.html");assertEquals("1",js("document.querySelectorAll('.opc-tutorial').length"));js("Array.from(document.querySelectorAll('.opc-tutorial button')).find(b=>b.textContent==='Próximo').click()");assertEquals("true",js("document.querySelector('.opc-tutorial h2').textContent.includes('2/3')"));js("Array.from(document.querySelectorAll('.opc-tutorial button')).find(b=>b.textContent==='Pular').click()");assertEquals("0",js("document.querySelectorAll('.opc-tutorial').length"));load("futdraw.html");assertEquals("0",js("document.querySelectorAll('.opc-tutorial').length"));
 }
 @Test public void homePreferencesAndInstalledVersionWork()throws Exception{
  load("index.html");assertEquals("5",js("OPC_INSTALLED.versionCode"));assertEquals("\"br.com.opesodacamisa.jogos.oficial\"",js("OPC_INSTALLED.package"));js("document.getElementById('app-preferences').click()");assertEquals("true",js("document.querySelector('dialog[open]').getAttribute('aria-label')==='Acessibilidade e dados'"));rule.getActivity().runOnUiThread(()->rule.getActivity().appBack());Thread.sleep(200);assertEquals("0",js("document.querySelectorAll('dialog[open]').length"));
 }

 @Test public void pixSupportFitsAndCopiesProvidedKey()throws Exception{
  load("apoie.html");assertEquals("true",js("document.documentElement.scrollWidth<=innerWidth+1"));js("document.getElementById('copy-pix').click()");Thread.sleep(300);android.content.ClipboardManager clipboard=(android.content.ClipboardManager)rule.getActivity().getSystemService(android.content.Context.CLIPBOARD_SERVICE);assertEquals("5cc3542e-3754-489b-9307-5396ba950b56",clipboard.getPrimaryClip().getItemAt(0).getText().toString());
 }


 @Test public void drafTeamCompletesAndRestoresDraft()throws Exception{
  load("drafteam.html");
  js("localStorage.removeItem('opc-drafteam-current-v1');document.getElementById('dt-duration').value='0';document.getElementById('dt-seed').value='android-drafteam-qa';document.getElementById('dt-start').click()");
  assertEquals("5",js("document.querySelectorAll('.criterion').length"));
  js("document.querySelector('#dt-stage button').click()");
  assertEquals("5",js("document.querySelectorAll('.criterion.back').length"));
  js("document.querySelector('.criterion.back').click()");
  js("document.querySelector('.formation-card').click()");
  assertEquals("5",js("document.querySelectorAll('#dt-pitch .slot').length"));
  for(int i=0;i<18;i++){
   if("true".equals(js("!!document.querySelector('.result-hero')")))break;
   js("(()=>{const p=document.querySelector('#dt-action .player-choice');if(p){p.click();}else{document.querySelector('#dt-action .gold')?.click();}})()");
   js("document.querySelector('#dt-action .gold:not(:disabled)')?.click()");
   assertEquals("true",js("document.documentElement.scrollWidth<=innerWidth+1"));
  }
  assertEquals("true",js("!!document.querySelector('.result-hero')"));
  load("drafteam.html");js("document.getElementById('dt-resume').click()");
  assertEquals("true",js("!!document.querySelector('.result-hero')"));
  assertEquals("5",js("document.querySelectorAll('#dt-pitch .slot').length"));
 }
}
