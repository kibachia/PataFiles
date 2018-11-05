<?php
/*
 * Zip Class v1.2.0
 * Elkadrey - codesgit.com
 * Last update: 2014-05-17
 */
class codesGit_files_zip
{
    private $zip = NULL;
    function __construct() 
    {
        $this->zip = NULL;
    }
    
    public function open($filePath, $status = NULL)
    {
        $this->close();
        if(!class_exists('ZipArchive')) return NULL;
        $this->zip = new ZipArchive;
        return $this->zip->open($filePath, $status); 
    }
    
    public function create($saveTo)
    {
        return $this->open(ZipArchive::CREATE);  
    }
    
    public function addFile($from, $fileName, $isFile = TRUE)
    {
        if($isFile) $this->zip->addFile($from, $fileName);
        else $this->zip->addFromString($fileName, $from);
    }
    
    public function addDir($dirPath, $toPath = NULL)
    {
        
        if($this->zip === NULL) return FALSE;
        if(is_dir($dirPath))
        {
            $dir = @opendir($dirPath);
            while(($file = @readdir($dir)) !== false)
            {
                if($file != "." && $file != "..")
                {                    
                    if(is_file($dirPath."/".$file)) $this->zip->addFile($dirPath."/".$file, ($toPath === NULL ? '' : $toPath.'/').$file);
                    else $this->addDir($dirPath."/".$file, ($toPath === NULL ? '' : $toPath.'/').$file);
                }
            }
        }
    }
    public function extract($zipFile, $toDir)
    {
        $this->close();
        if(!class_exists('ZipArchive')) return NULL;
        $this->zip = new ZipArchive;
        if($this->zip->open($zipFile) === TRUE) $extractStatus = @$this->zip->extractTo($toDir);
        $this->close();
        return $extractStatus;
    }
    
    public function listFiles()
    {
        if($this->zip === NULL) return FALSE;
        $files = array();
        for ($i = 0; $i < $this->zip->numFiles; $i++) 
        {
            $files[] = $this->zip->getNameIndex($i);            
        }
        return $files;
    }
    
    public function find($fileName)
    {
        if($this->zip === NULL) return FALSE;
        return $this->zip->locateName($fileName);
    }
    
    public function readFromIndex($index)
    {
        if($this->zip === NULL) return FALSE;
        return $this->zip->getFromIndex($index);
    }


    public function read($fileName)
    {
        if($this->zip === NULL) return FALSE;
        return @$this->zip->getStream($fileName);
    }
    
    public function close()
    {
        if($this->zip !== NULL) 
        {
            @$this->zip->close();
            $this->zip = NULL;
        }
    }
    
    public function __destruct() 
    {
        $this->close();
    }
}