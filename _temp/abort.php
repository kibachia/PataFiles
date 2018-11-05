<?php
if(isset($_POST['file']))
{
    if(file_exists($_POST['file'].'.tmp'))
    {        
        $file = $_POST['file'].'.tmp';
        $content = 'abort';
        if(function_exists('file_put_contents')) @file_put_contents($file, $content);
        else
        {
            $fil = @fopen($file, "w+");
            if($fil) 
            {
                fputs ($fil, $content);
                fclose($fil);                
            }            
        }
    }
}
?>