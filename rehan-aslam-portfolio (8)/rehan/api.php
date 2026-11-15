<?php
// Rehan Aslam portfolio: admin backend. Handles login, saving content and image uploads.
session_set_cookie_params(['httponly'=>true,'samesite'=>'Strict','secure'=>!empty($_SERVER['HTTPS'])]);
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$D=__DIR__.'/data/'; $SITE=$D.'site.json'; $AUTH=$D.'auth.json';
function out($a,$c=200){ http_response_code($c); echo json_encode($a); exit; }
function need(){
  if(empty($_SESSION['ok'])) out(['error'=>'Your session ended. Please log in again.'],401);
  if(!hash_equals((string)$_SESSION['csrf'],(string)($_SERVER['HTTP_X_CSRF']??''))) out(['error'=>'Security check failed. Reload the page and try again.'],403);
}
function auth(){
  global $AUTH;
  if(!is_file($AUTH)){
    $a=['user'=>'admin','hash'=>password_hash('Admin@345',PASSWORD_DEFAULT),'default'=>true];
    file_put_contents($AUTH,json_encode($a),LOCK_EX); return $a;
  }
  return json_decode(file_get_contents($AUTH),true);
}
$a=$_GET['a']??'';
$in=json_decode(file_get_contents('php://input'),true); if(!is_array($in)) $in=[];

if($a==='get'){
  if(!is_file($SITE)) out(['error'=>'data/site.json is missing.'],500);
  echo file_get_contents($SITE); exit;
}
if($a==='login'){
  $u=auth(); usleep(600000);
  if(hash_equals((string)$u['user'],(string)($in['user']??'')) && password_verify((string)($in['pass']??''),$u['hash'])){
    session_regenerate_id(true); $_SESSION['ok']=1; $_SESSION['csrf']=bin2hex(random_bytes(16));
    out(['ok'=>1,'csrf'=>$_SESSION['csrf'],'def'=>!empty($u['default'])]);
  }
  out(['error'=>'Wrong username or password.'],401);
}
if($a==='check'){
  if(empty($_SESSION['ok'])) out(['ok'=>0]);
  $u=auth(); out(['ok'=>1,'csrf'=>$_SESSION['csrf'],'def'=>!empty($u['default'])]);
}
if($a==='logout'){ session_destroy(); out(['ok'=>1]); }
if($a==='save'){
  need();
  foreach(['text','services','awards','projects','contact'] as $k){ if(!isset($in[$k])) out(['error'=>'Invalid data. Nothing was saved.'],400); }
  $t=$SITE.'.tmp';
  if(file_put_contents($t,json_encode($in,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT),LOCK_EX)===false) out(['error'=>'Could not write data/site.json. Make the data folder writable (permission 755 or 775).'],500);
  rename($t,$SITE); out(['ok'=>1]);
}
if($a==='upload'){
  need();
  $f=$_FILES['file']??null;
  if(!$f||$f['error']!==UPLOAD_ERR_OK) out(['error'=>'Upload failed. The image may be too large for your hosting.'],400);
  $ok=['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp','image/gif'=>'gif'];
  $mime=(new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
  if(!isset($ok[$mime])||!@getimagesize($f['tmp_name'])) out(['error'=>'Please choose a JPG, PNG, WebP or GIF image.'],400);
  if($f['size']>8*1024*1024) out(['error'=>'Image is larger than 8 MB.'],400);
  $dir=__DIR__.'/uploads/'; if(!is_dir($dir)) mkdir($dir,0755,true);
  $n=bin2hex(random_bytes(8)).'.'.$ok[$mime];
  if(!move_uploaded_file($f['tmp_name'],$dir.$n)) out(['error'=>'Could not save the image. Make the uploads folder writable.'],500);
  out(['path'=>'uploads/'.$n]);
}
if($a==='password'){
  need(); $u=auth();
  if(!password_verify((string)($in['cur']??''),$u['hash'])) out(['error'=>'Your current password is wrong.'],400);
  $nu=trim((string)($in['user']??'')); $np=(string)($in['pw']??'');
  if($nu===''||strlen($np)<8) out(['error'=>'Choose a username and a new password of at least 8 characters.'],400);
  file_put_contents($AUTH,json_encode(['user'=>$nu,'hash'=>password_hash($np,PASSWORD_DEFAULT),'default'=>false]),LOCK_EX);
  out(['ok'=>1]);
}
if($a==='message'){
  if(!empty($in['website'])) out(['ok'=>1]);
  $nm=trim(preg_replace('/\s+/',' ',(string)($in['name']??'')));
  $em=trim((string)($in['email']??''));
  $ty=trim(preg_replace('/\s+/',' ',(string)($in['type']??'')));
  $bd=trim(preg_replace('/\s+/',' ',(string)($in['budget']??'')));
  $ms=trim((string)($in['message']??''));
  if($nm===''||$ty===''||$bd===''||$ms===''||!filter_var($em,FILTER_VALIDATE_EMAIL)) out(['error'=>'Please complete every field with a valid email address.'],400);
  if(strlen($nm)>120||strlen($em)>160||strlen($ty)>80||strlen($bd)>80||strlen($ms)>5000) out(['error'=>'Your message is too long.'],400);
  if(time()-(int)($_SESSION['lastmsg']??0)<20) out(['error'=>'Please wait a few seconds before sending another message.'],429);
  $site=is_file($SITE)?json_decode(file_get_contents($SITE),true):[];
  $to=$site['contact']['email']??'';
  if(!filter_var($to,FILTER_VALIDATE_EMAIL)) $to='royalshadow3435@gmail.com';
  $log=$D.'messages.json'; $all=is_file($log)?json_decode(file_get_contents($log),true):[]; if(!is_array($all)) $all=[];
  $all[]=['time'=>date('c'),'name'=>$nm,'email'=>$em,'type'=>$ty,'budget'=>$bd,'message'=>$ms];
  @file_put_contents($log,json_encode($all,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT),LOCK_EX);
  $host=preg_replace('/^www\./','',preg_replace('/:\d+$/','',(string)($_SERVER['HTTP_HOST']??'localhost')));
  $head="From: Website <noreply@".$host.">\r\nReply-To: ".$em."\r\nContent-Type: text/plain; charset=UTF-8";
  $subj='=?UTF-8?B?'.base64_encode('New project enquiry: '.$ty).'?=';
  $body="Name: $nm\nEmail: $em\nProject type: $ty\nBudget: $bd\n\n$ms\n";
  if(!@mail($to,$subj,$body,$head)) out(['error'=>'The message could not be sent from the server.'],500);
  $_SESSION['lastmsg']=time(); out(['ok'=>1]);
}
out(['error'=>'Unknown request.'],400);
