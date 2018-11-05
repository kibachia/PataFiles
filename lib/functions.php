<?php
function checkLogin()
{    
    global $userName, $enableLogin;
    if($enableLogin !== TRUE) 
    {
       
        $_SESSION['finder']->isAdmin = $_SESSION['finder']->login = TRUE;
         return TRUE;
    }
    return $userName === '' ? NULL : (isset($_SESSION['finder']->login) && $_SESSION['finder']->login === TRUE ? TRUE : FALSE);    
}
function login($username, $password)
{   
    global $userName, $passWord, $_users;
    if(!isset($_SESSION['finder']) || !$_SESSION['finder']) $_SESSION['finder'] = new stdClass();
    
    $_SESSION['finder']->login = $username != "" && $userName == $username && $passWord == $password ? TRUE : FALSE;
    if($_SESSION['finder']->login === TRUE) $_SESSION['finder']->isAdmin = TRUE;
    else
    {        
        $_SESSION['finder']->isAdmin    = FALSE;
        $_SESSION['finder']->login      = $username !== '' && isset($_users[$username]) && $_users[$username][0] === $password ? TRUE : FALSE;
    }
    
    if($_SESSION['finder']->login === TRUE) $_SESSION['finder']->user = $username;
    
    return $_SESSION['finder']->login;
}

function logout()
{
    $_SESSION['finder']->login = false;
}

function completeData($str, $cStr, $toTheEnd = TRUE)
{
    if($toTheEnd && substr($str, strlen($str) - strlen($cStr), strlen($cStr)) != $cStr) $str .= $cStr;
    elseif(!$toTheEnd && substr($str, 0, strlen($str) - strlen($cStr)) != $cStr) $str = $cStr.$str;
    return $str;
}


function ext($fileName)
{
    $ext = explode(".", $fileName);
    return end($ext);
}

function clearOldTemp()
{
    $dir = @opendir('_temp');
    if($dir)
    {
        while(($file = readdir($dir)) !== FALSE)
        {
            if(is_file('_temp/'.$file) && strtolower(ext($file)) == 'tmp')
            {
                $tim = substr($file, 0, strlen($file) - 4);
                if($tim < time()-(60*60*24)) @unlink('_temp/'.$file);
            }
        }
    }
}

function searchForItem($itemName, $currentDir, $searchDetails, $jsn = NULL, $searchRulls = NULL)
{
    if($searchRulls === NULL) $searchRulls = substr($itemName, 0, 2) == '*.' ? true : false;
    if($jsn === NULL)
    {
        $jsn = new stdClass();
        $jsn->status = 0;    
        $jsn->searchQuery = $itemName;
        $jsn->filesfound = array();
        $jsn->dirsfound = array();
    }
    
    
    if(!is_object($searchDetails) || !isset($searchDetails->file)) $jsn->status = 1;
    if(!isset($searchDetails->type) || !$searchDetails->type || !is_numeric($searchDetails->type) || $searchDetails->type > 3 || $searchDetails->type < 0) $searchDetails->type = 0;
    
    $file = $searchDetails->file;    
    if(is_dir($currentDir))
    {
        $currentDir = completeData($currentDir, "/");
        
        
        
        if($searchDetails->type == 0 || $searchDetails->type == 2)
        {
            $dirNames = explode("/", $currentDir);
            unset($dirNames[count($dirNames) - 1]);
            $dirName = end($dirNames);   
            unset($dirNames[count($dirNames) - 1]);
            $dirPath = completeData(implode("/", $dirNames), "/");
            
            if($searchRulls)
            {
                if(strtolower(substr($itemName, 1)) == strtolower(substr($dirName, strlen($dirName) - strlen($itemName) - 1)))
                {
                    $jsn->dirsfound[] = array($dirName, $dirPath, 'folder');                            
                    setData($file, $jsn);
                }
            }
            else
            {
                $chk = explode(strtolower($itemName), strtolower($dirName));

                if(count($chk) > 1) 
                {                
                    $jsn->dirsfound[] = array($dirName, $dirPath, 'folder');                            
                    setData($file, $jsn);
                }
            }
        }        
        $dir = opendir($currentDir);
        if($dir)
        {
            while(($item = readdir($dir)) !== FALSE)
            {
                $chkFile = getData($file);
                if($chkFile && $chkFile == 'abort') 
                {
                    setData($file, $jsn, TRUE);
                }
                if($item != "." && $item != "..")
                {                    
                    if(is_file($currentDir.$item))
                    {
                        if($searchDetails->type < 2)
                        {
                            if($searchRulls)
                            {                                
                                if(strtolower(substr($itemName, 1)) == strtolower(substr($item, strlen($item) - strlen($itemName) + 1)))
                                {
                                    $jsn->filesfound[] = array($item, $currentDir, strtolower(ext($item)));                            
                                    setData($file, $jsn);
                                }
                            }
                            else
                            {
                                $chk = explode(strtolower($itemName), strtolower($item));
                                if(count($chk) > 1) 
                                {                
                                    $jsn->filesfound[] = array($item, $currentDir, strtolower(ext($item)));                                  
                                    setData($file, $jsn);
                                }
                            }
                        }
                        elseif($searchDetails->type == 3 && ($searchDetails->filesTypes === NULL || (is_array($searchDetails->filesTypes) && in_array(strtolower(ext($item)), $searchDetails->filesTypes))))
                        {
                            $contents = getData($currentDir.$item, TRUE);
                            //die($contents);
                            if($contents) 
                            {
                                $chk = explode(strtolower($itemName), strtolower(str_replace("\n", "", $contents)));
                                if(count($chk) > 1) 
                                {                                              
                                    $jsn->filesfound[] = array($item, $currentDir, strtolower(ext($item)), (count($chk)-1));                            
                                    setData($file, $jsn);
                                }
                            }
                        }
                    }
                    else $jsn = searchForItem($itemName, $currentDir.$item, $searchDetails, $jsn, $searchRulls);
                }
            }
        }           
    }
    return $jsn;
}
function pregSlashes($str, $clearing = FALSE)
{
    $replacements['['] = '\[';
    $replacements[']'] = '\]';
    $replacements['{'] = '\{';
    $replacements['}'] = '\}';
    $replacements['/'] = '\/';
    $replacements['('] = '\(';
    $replacements[')'] = '\)';
    $replacements['>'] = '\>';
    $replacements['<'] = '\<';
    $replacements['"'] = '\"';
    $replacements['"'] = "\'";
    $replacements['#'] = "\#";  
    
    if($clearing) $replacements[' '] = "";  
    return str_replace(array_keys($replacements), $clearing ? '_' : array_values($replacements), $str);
}

function getData($file, $focusTypes = FALSE)
{
    if($focusTypes === TRUE)
    {
        include_once 'codesGit/files/office.php';
        $office = new codesGit_files_office();
        $data = $office->read($file);
        if($data) return $data;        
    }
    
    if(function_exists('file_put_contents')) return @file_get_contents($file, $content);
    else
    {
        $fil = @fopen($file, "r");
        if(!$fil) return FALSE;
        @$data = fread($fil, filesize($file));
        fclose($fil);
        return $data;
    }
}
function putData($file, $content)
{
    if(function_exists('file_put_contents'))
    {
        $crt = @file_put_contents($file, $content);
        return $crt ? TRUE : FALSE;
    }
    else
    {
        $fil = @fopen($file, "w+");
        if($fil) 
        {
            fputs ($fil, $content);
            fclose($fil);
            return TRUE;
        }
        else return FALSE;
    }
}

function setData($file, $jsn, $exit = FALSE, $access = TRUE)
{
    $jsn->access = $access;
    $jsn->status = $exit ? 1 : 0;
    putData($file, json_encode($jsn));       
    if($exit) exit;
}

function tagsConverter($text, $returnBack = FALSE)
{
   $tag['<'] = '&lt;';
   $tag['>'] = '&gt;';
   if(!$returnBack)
   {
        return str_replace(array_keys($tag), array_values($tag), $text);
   }
   else
   {
        return str_replace(array_values($tag), array_keys($tag), $text);
   }
}
?>