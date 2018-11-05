<?php
/*
 * Zip Class v1.0.0
 * Elkadrey - codesgit.com
 * Last update: 2014-05-17
 */

class codesGit_files_office
{
    private $filename;

    public function __construct($filePath = NULL) 
    {
        if($filePath) $this->filename = $filePath;
    }
    
    public function read($filePath)
    {
        $this->filename = $filePath;
        return $this->convertToText();
    }

    private function readDoc() 
    {
        $fileHandle = fopen($this->filename, "r");
        
        $line = @fread($fileHandle, filesize($this->filename));   
        $lines = explode(chr(0x0D), $line);
        $content = "";
        foreach($lines as $thisline)
        {
          $pos = strpos($thisline, chr(0x00));
          if (($pos === FALSE) && strlen($thisline) > 0) $content .= $thisline." ";            
        }
        
        return preg_replace("/[^a-zA-Z0-9\s\,\.\-\r\t@\/\_\(\)]/", "", $content);        
    }

    private function readDocx()
    {
        include_once 'zip.php';
        $striped_content = '';
        $content = '';
        $zip = new codesGit_files_zip();
        $zipStatus = $zip->open($this->filename);

        if($zipStatus !== TRUE) return FALSE;       
        foreach($zip->listFiles() as $zip_entry)
        {
            $file = $zip->read($zip_entry);
            while(!feof($file))
            {
                $content .= fread($file, 1024);
            }            
        }
        $zip->close();

        $content = str_replace('</w:r></w:p></w:tc><w:tc>', " ", $content);
        $content = str_replace('</w:r></w:p>', "\r\n", $content);
        $striped_content = strip_tags($content);
        
        return $striped_content;
    }

    function readXlsx()
    {
        include_once 'zip.php';
        $xml_filename = "xl/sharedStrings.xml"; //content file name
        $zip = new codesGit_files_zip();
        $zipStatus = $zip->open($this->filename);

        $output_text = "";
        if($zipStatus !== TRUE) return FALSE;   
        
        $file = $zip->read($xml_filename);
        while(!feof($file))
        {
            $output_text .= fread($file, 1024);
        } 
        $zip->close();
        $output_text = str_replace("><", ">{[Splitter]}<", $output_text);
        $output_text = str_replace("{[Splitter]}", "\n", strip_tags($output_text));
        return $output_text;
    }
    
    private function readXls()
    {
        include_once 'xls.php';
        $data = new Spreadsheet_Excel_Reader();
        $data->read($this->filename);
        $content = "";
        for ($i = 1; $i <= $data->sheets[0]['numRows']; $i++) 
        {
            for ($j = 1; $j <= $data->sheets[0]['numCols']; $j++) 
            {
                    @$content .= $data->sheets[0]['cells'][$i][$j]." ";
            }
            @$content .= "\n";
        }
        return $content;
    }
    
    private function readPdf()
    {
        include_once 'pdf.php';        
        return pdf2text($this->filename);        
    }

    public function convertToText() 
    {

        if(isset($this->filename) && !file_exists($this->filename)) return FALSE;

        $fileArray = pathinfo($this->filename);
        $file_ext  = $fileArray['extension'];
        switch($file_ext)
        {
            case 'doc':
                return $this->readDoc();
                break;
            case 'docx':
                return $this->readDocx();
                break;
            case 'xlsx':
                return $this->readXlsx();
            case 'xls':
                return $this->readXls();
                break;
            case 'pdf':
                return $this->readPdf();
                break;
            default:
                return NULL;
                
        }               
    }

}
?>