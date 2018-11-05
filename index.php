<?php
##############################
## Powered by: Codesgit.com ##
## Author: Ahmed Elkadrey   ##
##############################

session_start();
include_once 'lib/functions.php';
include_once 'lib/product.php';
if(!isset($_SESSION['finder'])) $_SESSION['finder'] = (object) array('login'=>FALSE, 'isAdmin'=>FALSE, 'user'=>'');
include_once 'config.php';
$isLogin = checkLogin();
$isSetup = $isLogin === NULL ? FALSE : TRUE;
$isAdmin = isset($_SESSION['finder']->isAdmin) ? $_SESSION['finder']->isAdmin : FALSE;
clearOldTemp();

if(isset($_POST['req']) && $_POST['req'])
{
    $json = new stdClass();
    switch($_POST['req'])
    {   
        case 'setUsers':
            if(!$isLogin || !$_SESSION['finder']->isAdmin) exit;            
            $json->status = NULL;
            if(isset($_POST['users']) && isset($_POST['passwords']) && isset($_POST['access']) && isset($_POST['adminDetails']) && is_array($_POST['adminDetails']))
            {
                $content = '<?PHP
##################  Access Login ###############
$enableLogin    = '.$enableLogin.'; // TRUE ==> Login is enabled  |  FALSE ==> Login is disabled
$userName       = "'.$_POST['adminDetails']['username'].'"; //Your username
$passWord       = "'.$_POST['adminDetails']['password'].'"; //Your Password

################################################
$limitAccess    = '.$limitAccess.'; //Specific main path, to change this replace $_SERVER["DOCUMENT_ROOT"] with your full path like "/home/blah/www/"

##################  Users Access Login ###############
$_users = array();'."\r\n";
                
                
                if(is_array($_POST['users']))
                {
                    foreach($_POST['users'] as $i=>$user)
                    {
                        $content .= '$'."_users['".stripslashes($user)."'] = array('".$_POST['passwords'][$i]."', ".($_POST['access'][$i] == '' ? '$_SERVER["DOCUMENT_ROOT"]' : "'".$_POST['access'][$i]."'").");\r\n";
                    }
                }
                $json->status = putData('config.php', $content."\r\n?>"); 
            }
            break;
        case 'getUsers':
            if(!$isLogin || !$_SESSION['finder']->login) exit;            
            $json->admin = array($userName, $passWord);
            $json->users = $_users;
            $json->limitAccess = $limitAccess;
            break;
        case 'createUser':
            $json->status = NULL;
            // || $isLogin
            if((!$isSetup) && isset($_POST['username']) && $_POST['username'] && isset($_POST['password']))
            {
                $json->status = putData('config.php', '<?PHP
##################  Access Login ###############

$userName       = "'.$_POST['username'].'"; //Your username
$passWord       = "'.$_POST['password'].'"; //Your Password

################################################
$limitAccess    = $_SERVER["DOCUMENT_ROOT"];

$_users = array();
?>');                
            }
            break;
        case 'login':
                $json->status = isset($_POST['u']) && isset($_POST['p']) ? login($_POST['u'], $_POST['p']) : FALSE;
                $isAdmin = $_SESSION['finder']->isAdmin;
                $json->dir = !$isAdmin ? $_users[$_SESSION['finder']->user][1] : $limitAccess;
                $json->admin = $isAdmin;
            break;
        case 'logout':
            logout();
            break;
        case 'savedResult':            
            if(!$isLogin) exit;
            $dir = @opendir('_temp');
            $json->savedFiles = array();
            if($dir)
            {
                $usr = !$isAdmin ? $_SESSION['finder']->user : $userName;
                $usr = strtolower(str_replace(array(".", "_"), "", $usr));
                while(($file = readdir($dir)) !== FALSE)
                {
                    $exts = explode(".", $file);
                    if(is_file('_temp/'.$file) && strtolower($exts[count($exts) - 1]) == 'sav' && strtolower($exts[count($exts) - 2]) == $usr)
                    {
                        $fileAR = explode(".", substr($file, 0, strlen($file) - 4));
                        $json->savedFiles[] = array($file, str_replace("_", " ", $fileAR[0]), date("D, d M Y H:i", $fileAR[1]));
                    }
                }
            }
        break;
        case 'delSavedFile':
            if(!$isLogin) exit;
            $json->fileStatus = NULL;
            if(isset($_POST['file']) && $_POST['file'] && file_exists('_temp/'.$_POST['file'])) 
            {
                $json->fileStatus = @unlink('_temp/'.$_POST['file']);
            }
            break;
        case 'saveResult':
            if(!$isLogin) exit;
            if(isset($_POST['file']) && $_POST['file'] && isset($_POST['fileName']) && $_POST['fileName'])
            {
                $json->status = NULL;
                if(file_exists('_temp/'.$_POST['file'].'.tmp'))
                {
                    $usr = !$isAdmin ? $_SESSION['finder']->user : $userName;
                    $usr = '.'.strtolower(str_replace(array(".", "_"), "", $usr));
                    $saveTo = '_temp/'.pregSlashes($_POST['fileName'], TRUE).'.'.$_POST['file'].$usr.'.sav';
                    if(!file_exists($saveTo))
                    {                        
                        $sav = @copy('_temp/'.$_POST['file'].'.tmp', $saveTo);
                        $json->status = $sav ? TRUE : NULL;
                    } else $json->status = FALSE;
                }
            }
            break;
        case 'browse':
            if(!$isLogin) exit;
            
            if(!$isAdmin) $limitAccess = $_users[$_SESSION['finder']->user][1];
            if(!$limitAccess || $limitAccess === "") $limitAccess = $_SERVER['DOCUMENT_ROOT'];
            
            if((!isset($_POST['rootPath']) || !$_POST['rootPath'])) $_POST['rootPath'] = $limitAccess;
    
            if(isset($_POST['options']) && $_POST['options'] == "up")
            {
                if(substr($_POST['rootPath'], strlen($_POST['rootPath']) - 1, 1) == "/") $_POST['rootPath'] = substr($_POST['rootPath'], 0, strlen($_POST['rootPath']) - 1);
                $root = explode("/", $_POST['rootPath']);
                unset($root[count($root) - 1]);
                $_POST['rootPath'] = implode("/", $root);
            }
            
            //die(substr($_POST['rootPath'], 0, strlen($limitAccess)));
            if(substr($_POST['rootPath'], 0, strlen($limitAccess)) != $limitAccess) $_POST['rootPath'] = $limitAccess;
            
            if(substr($_POST['rootPath'], strlen($_POST['rootPath']) - 1, 1) != "/") $_POST['rootPath'] .= "/";
            $dir = @opendir($_POST['rootPath']);
            $json->path = $_POST['rootPath'];
            $json->dirs = array();
            while(($target = readdir($dir)) !== false)
            {
                if(!in_array($target, array(".", "..", ".htaccess")) && is_dir($_POST['rootPath'].$target))
                $json->dirs[] = $target."/";
            }
            break; 
        case 'showInLine':
            if(!$isLogin) exit;
            if(isset($_POST['searchQuery']) && $_POST['searchQuery'] && isset($_POST['file']) && $_POST['file'])
            {                
                $file = getData($_POST['file'], TRUE);
                $json->data = array();
                if($file)
                {
                    $lines = explode("\n", $file);
                    $search = explode(strtolower($_POST['searchQuery']), strtolower($file));
                    $lin = 1;
                    foreach($search as $id=>$qr)
                    {
                        if(count($search) > $id + 1)
                        {
                            $linesAR = explode("\n", $qr);
                            $lin += count($linesAR) - 1;
                            if($lin > 1) $json->data[$id][] = array($lin-1, tagsConverter($lines[$lin-2]));
                            $json->data[$id][] = array($lin, tagsConverter($lines[$lin-1]), TRUE);
                            if($lin < count($lines)) $json->data[$id][] = array($lin+1, tagsConverter($lines[$lin]));
                        }
                    }
                }
            }
            break;
        case 'search':
            if(!$isLogin) exit;
            if(isset($_POST['searchQuery']))
            {
                $i = 0;                   
                ignore_user_abort(false);
                
                if(!isset($_POST['fileName'])) exit;
                set_time_limit(0);
                $file = '_temp/'.$_POST['fileName'].'.tmp';
                @unlink($file);
                $jsn = new stdClass();
                $jsn->status = 0;
                $jsn->access = true;
                $jsn->searchQuery = $_POST['searchQuery'];
                $jsn->filesfound = array();
                $jsn->dirsfound = array();
                
                
                if(!$isAdmin) $limitAccess = $_users[$_SESSION['finder']->user][1];
                if(!$limitAccess || $limitAccess === "") $limitAccess = $_SERVER['DOCUMENT_ROOT'];
                
                if(!isset($_POST['searchPath']) || $_POST['searchPath'] == "" || !is_string($_POST['searchPath'])) $_POST['searchPath'] = $limitAccess;
                if(substr($_POST['searchPath'], 0, strlen($limitAccess)) != $limitAccess)
                {
                    setData($file, $jsn, TRUE, FALSE);
                }
                
                $create = putData($file, json_encode($jsn));
                if($create)
                {
                    $searchDetails = new stdClass();
                    $searchDetails->file = $file;
                    $searchDetails->type = isset($_POST['searchType']) ? $_POST['searchType'] : 0;
                    $searchDetails->filesTypes = isset($_POST['filesTypes']) && $_POST['filesTypes'] != '' ? explode(";", strtolower($_POST['filesTypes'])) : NULL;
                    $jsn = searchForItem($_POST['searchQuery'], $_POST['searchPath'], $searchDetails);
                }
                
                setData($file, $jsn, TRUE);
            }            
            exit;
            break;
    }
    
    header('Content-Type: application/json');
    echo json_encode($json);
    exit;
}

if(isset($_GET['download']) && $_GET['download'] && $isLogin)
{
    if(file_exists($_GET['download']))
    {
        $fileName = explode("/", $_GET['download']);
        $ext = explode(".", $_GET['download']);
        header('Content-type: application/'.end($ext));               
        header('Content-Disposition: attachment; filename="'.end($fileName).'"');
        readfile($_GET['download']);
    }                
    exit;
}


if(!isset($isAdmin) || !$isAdmin) $limitAccess = isset($_users[$_SESSION['finder']->user][1]) ? $_users[$_SESSION['finder']->user][1] : NULL;
if(!$limitAccess || $limitAccess === "") $limitAccess = $_SERVER['DOCUMENT_ROOT'];
$limitAccess = completeData($limitAccess, "/");
$title = $__Product->name.' v'.$__Product->version;


//Load HTML Document
include './template.php';
?>
