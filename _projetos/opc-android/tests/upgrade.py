# Runs only on the disposable Android emulator, against two publicly signed releases.
import os,re,json,time,subprocess,urllib.request,xml.etree.ElementTree as ET
from pathlib import Path
out=Path('upgrade-proof');out.mkdir(exist_ok=True)
tag=os.environ['OPC_RELEASE_TAG']
if not re.fullmatch(r'android-v\d+\.\d+\.\d+',tag): raise RuntimeError('Invalid release tag')
version=tag.removeprefix('android-v');base='https://github.com/dacamisaopeso-art/o-peso-da-camisa/releases/download/'
old=out/'previous.apk';new=out/'current.apk'
for url,file in [(base+'android-v0.4.0/OPC-Jogos-0.4.0.apk',old),(base+tag+'/OPC-Jogos-'+version+'.apk',new)]:urllib.request.urlretrieve(url,file)
def run(*args):return subprocess.check_output(args,text=True,stderr=subprocess.STDOUT)
sdk=Path(os.environ['ANDROID_HOME'])/'build-tools'/'35.0.0'
cert='82e768255953f1c5b0549690bc374671a3e80a70674179841c8d5b23ab2262dc'
for file in [old,new]:
 assert cert in run(str(sdk/'apksigner'),'verify','--print-certs',str(file))
 assert "package: name='br.com.opesodacamisa.jogos.oficial'" in run(str(sdk/'aapt'),'dump','badging',str(file))
pkg='br.com.opesodacamisa.jogos.oficial';component=pkg+'/br.com.opesodacamisa.jogos.MainActivity'
assert 'Success' in run('adb','install',str(old));run('adb','shell','am','start','-W','-n',component)
def nodes():
 try:
  dump=run('adb','shell','uiautomator','dump','/sdcard/opc-upgrade.xml')
  xml=run('adb','shell','cat','/sdcard/opc-upgrade.xml')
 except subprocess.CalledProcessError as error:
  (out/'last-ui.xml').write_text(str(error.output));time.sleep(1);return []
 (out/'last-ui.xml').write_text(xml);start=xml.find('<hierarchy');end=xml.rfind('</hierarchy>');
 if start<0 or end<0:
  time.sleep(1);return []
 return ET.fromstring(xml[start:end+len('</hierarchy>')]).iter('node')
def find(prefix):
 for _ in range(12):
  for node in nodes():
   label=node.get('content-desc','') or node.get('text','')
   bounds=list(map(int,re.findall(r'\d+',node.get('bounds',''))))
   if prefix in label and len(bounds)==4 and bounds[2]>bounds[0] and bounds[3]>bounds[1]:return node,label
  run('adb','shell','input','swipe','250','1300','250','550','350');time.sleep(.3)
 run('adb','shell','screencap','-p','/sdcard/opc-upgrade.png');run('adb','pull','/sdcard/opc-upgrade.png',str(out/'upgrade.png'));raise RuntimeError('Could not find test control: '+prefix)
# Set a genuine favorite in the previous release, then install the new release in place.
node,label=find('Adicionar aos favoritos:')
x1,y1,x2,y2=map(int,re.findall(r'\d+',node.get('bounds')));run('adb','shell','input','tap',str((x1+x2)//2),str((y1+y2)//2));time.sleep(.5)
find(label.replace('Adicionar aos favoritos:','Remover dos favoritos:'))
assert 'Success' in run('adb','install','-r',str(new))
run('adb','shell','am','start','-W','-n',component)
find(label.replace('Adicionar aos favoritos:','Remover dos favoritos:'))
packages=run('adb','shell','pm','list','packages','br.com.opesodacamisa.jogos').strip().splitlines();assert packages==['package:'+pkg],packages
assert 'versionName='+version in run('adb','shell','dumpsys','package',pkg)
run('adb','shell','screencap','-p','/sdcard/opc-upgrade.png');run('adb','pull','/sdcard/opc-upgrade.png',str(out/'upgrade.png'))
(out/'result.json').write_text(json.dumps({'previous':'0.4.0','current':version,'package':pkg,'sameCertificate':True,'installInPlace':True,'favoritePreserved':True,'onlyOneApp':True},indent=2))
print('PASS: official APK upgrades 0.4.0 in place, same signature and package, favorite preserved, one installed app.')
