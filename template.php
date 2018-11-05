<?php if(!isset($title)) exit; ?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title><?=$title?></title>

    <!-- Bootstrap -->
    <link href="./css/style.css" rel="stylesheet" />
    <link href="css/bootstrap.min.css" rel="stylesheet" />

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="js/jquery-1.11.0.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/bootstrap.min.js"></script>
    <script src="js/functions.js"></script>
    <script src="js/elements.js"></script>
  </head>
  <body>
<header class="navbar navbar-static-top navbar-inverse" id="top" role="banner">
  <div class="container">
    <div class="navbar-header">
      <button class="navbar-toggle" type="button" data-toggle="collapse" data-target=".bs-navbar-collapse">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
        <a href="/" id="brand" class="navbar-brand"><?=$__Product->name?></a>      
    </div>
      
    <nav class="collapse navbar-collapse bs-navbar-collapse" role="navigation">    
      <ul class="nav navbar-nav navbar-right">          
          <li id="savedResults"><a class="pointer">Manage saved results</a></li>
          <li id="mangeUsers"><a class="pointer">Manage Users</a></li>
          <li id="logout"><a class="pointer">Logout</a></li>
          <li id="loginBtn"><a class="pointer">Login</a></li>
      </ul>
    </nav>
  </div>
</header>
      <div id="body">
      
      
      <!-- Search Form -->
      
      <form action="" method="post" id="searchForm" class="form-horizontal" role="form">
          <div class="row">          
              <div class="input-group">
                  <span class="input-group-addon">Search word</span>
                  <input title="Type your the item name or the text that you want to search for here" style="height: 34px;" name="searchQuery" id="searchQuery" placeholder='ex: index.php or echo "search for code text"; ... etc' type="text" class="form-control required tooltips">
                <span class="input-group-btn">
                    <button class="btn btn-default" type="submit">Go!</button>
                </span>
              </div><!-- /input-group -->
          </div>
          
          
          <div class="clr br"></div>
                           
          <div class="row" id="searchType">
             
              <div class="col-lg-6 br_bttom">
                <div class="input-group">
                  <span class="input-group-addon">
                      <input checked="checked" name="searchType" value="0" type="radio" id="sr_files_dirs">
                  </span>
                    <label for="sr_files_dirs" class="form-control">Search for files and folders</label>
                </div><!-- /input-group -->
              </div><!-- /.col-lg-6 -->              
              
              <div class="col-lg-6 clr br_bttom">
                <div class="input-group">
                  <span class="input-group-addon">
                      <input name="searchType"  value="1" type="radio" id="sr_files_only">
                  </span>
                    <label for="sr_files_only" class="form-control">Search for files only</label>
                </div><!-- /input-group -->
              </div><!-- /.col-lg-6 --> 
              
              <div class="col-lg-6 clr br_bttom">
                <div class="input-group">
                  <span class="input-group-addon">
                      <input name="searchType" type="radio"  value="2" id="sr_dirs_only">
                  </span>
                    <label for="sr_dirs_only" class="form-control">Search for folders only</label>
                </div><!-- /input-group -->
              </div><!-- /.col-lg-6 --> 
              
              <div class="col-lg-6 clr br_bttom">
                <div class="input-group">
                  <span class="input-group-addon">
                      <input  name="searchType" type="radio"  value="3" id="sr_inside_files">
                  </span>
                 <label for="sr_inside_files" class="form-control">Search Inside Files</label>                 
                </div><!-- /input-group -->
              </div><!-- /.col-lg-6 --> 
              
              <div class="col-lg-3 tooltips" title="In case ''Search Inside Files'' is activated, You can specify files to search inside theme or leave it blank to search in all files">
                  <div class="input-group">
                    <span class="bold input-group-addon">*.</span>
                    <input type="text" name="filesTypes" id="filesTypes" disabled="disabled" class="form-control fileTypes" placeholder="ex: php | Split types with ;">
                </div>
              </div>
          </div>
          
          
           <div class="clr br"></div>
          
           <!-- Button trigger modal -->
           <div class="row">          
              <div class="input-group">
                  <span class="input-group-addon">Search in directory</span>
                  <input  placeholder='ex: /www/' type="text" name="searchIn" value="<?=$limitAccess?>" id="searchIn" class="form-control">
                <span class="input-group-btn">
                    <button class="btn btn-default" data-toggle="modal" data-target="#browse" type="button">Browse server...</button>
                </span>
              </div><!-- /input-group -->
          </div>

<!-- Modal -->
<div class="modal fade" id="browse" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="myModalLabel">Server Browser</h4>
        
        <div class="text-right">
            <button type="button" id="upLevel" data-loading-text="Loading..." class="btn btn-primary">Up Level</button>
        </div>
      </div>
      <div class="modal-body scroll">
       <table class="table">
           
      </table>
      </div>
      <div class="modal-footer">        
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" id="selectDir" data-loading-text="Loading..." class="btn btn-success">Select Directory</button>        
      </div>
    </div>
  </div>
</div>
    



<div class="clr br"></div>
<button class="btn btn-primary btn-lg center-block">
  Search
</button>   
</form>

<!-- /Search Form -->


<div id="searchResults" class="scroll" style="display: none;">
    <div class="panel panel-default">
        <!-- Default panel contents -->
        <div class="panel-heading">Search for "<span id="searchFor"></span>"</div>
       <table class="table table-hover">
           <tr class="pointer">
               <th style="width: 16px;"></th>
               <th style="max-width: 45%;">Name</th>
               <th style="max-width: 45%;">Full Path</th>
           </tr>
           <tbody id="searchResultsList"></tbody>
       </table>
     </div>   
        <button id="backSearch" class="btn btn-primary">Back to Search</button>  
        <button id="saveSearch" class="btn btn-success">Save Search Result</button> 
        <div class="br"></div>
</div>

      
<!-- Searching Modal -->      
<div class="modal fade" id="searching" tabindex="-1" role="dialog" aria-labelledby="searchLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="searchLabel">Searching ....</h4>
      </div>
      <div class="modal-body">
          <img class="center-block" src="css/images/search-icon.gif" />
      </div>
      <div class="modal-footer">    
          <span style="float: left">Items found: <b>0</b> Item(s)</span>
        <button type="button" class="btn btn-default" data-dismiss="modal">Stop</button>        
      </div>
    </div>
  </div>
</div> 

<!-- Saved Search Results Modal -->      
<div class="modal fade" id="savedResultsModal" tabindex="-1" role="dialog" aria-labelledby="savedResultsModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="savedResultsModalLabel">Saved Search results</h4>
      </div>
      <div class="modal-body scroll"></div>
      <div class="modal-footer">              
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>        
      </div>
    </div>
  </div>
</div> 

<!-- Manage Users Modal -->      
<div class="modal fade" id="mangeUsersModal" tabindex="-1" role="dialog" aria-labelledby="mangeUsersModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="mangeUsersModalLabel">Manage Users</h4>
      </div>
      <div class="modal-body"></div>
      <div class="modal-footer">              
        <input type="button" id="saveUsersChanges" data-loading-text="Loading..." class="btn btn-success" value="Save Changes" />
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>        
      </div>
    </div>
  </div>
</div> 
    

<!-- file search details -->
<div class="modal fade" id="fileResultDetails" tabindex="-1" role="dialog" aria-labelledby="FileSearchDetailsModal" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title" id="FileSearchDetailsModal">Item Details</h4>
      </div>
      <div class="modal-body">
          <table class="table">
            <tr class="pointer">               
                <th class="danger" style="max-width: 30%;">Name</th>
                <td class="warning" style="max-width: 70%;"></td>
            </tr>
            <tr class="pointer">               
                <th class="danger" style="max-width: 30%;">Type</th>
                <td class="warning" style="max-width: 70%;"></td>
            </tr>
            <tr class="pointer">               
                <th class="danger" style="max-width: 30%;">Full Path</th>
                <td class="warning" style="max-width: 70%;"></td>
            </tr>            
        </table>                   
        <div class="text-center">
            <button id="downloadFile"  class="btn btn-primary btn-lg">Download the file</button>
            <button id="showDeitalsLine" data-loading-text="Loading..."  class="btn btn-success btn-lg">Show in line</button>
        </div>
        <div class="br"></div>
        <div id="showInLine" style="display: none;height: 250px;overflow-x: auto;" class="scroll"></div>  
      </div>
        
        <div class="modal-footer">              
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>        
      </div>
    </div>
  </div>
</div>

<!-- Login Modal -->
<div class="modal fade" id="login" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title" id="myModalLabel">Login access required</h4>
      </div>
      <div class="modal-body">
                  
          <form id="loginFRM" class="form-horizontal" role="form">
            <div class="form-group">
              <label for="userName" class="col-sm-2 control-label">Username</label>
              <div class="col-sm-10">
                <input type="text" class="form-control required" id="userName" placeholder="Username">
              </div>
            </div>
            <div class="form-group">
              <label for="password" class="col-sm-2 control-label">Password</label>
              <div class="col-sm-10">
                <input type="password" class="form-control required" id="password" placeholder="Password">
              </div>
            </div>           
            <div class="form-group">
              <div class="col-sm-offset-2 col-sm-10">
                <button type="submit" data-loading-text="Loading..." class="btn btn-default">Login</button>
              </div>
            </div>
          </form>          
      </div>      
    </div>
  </div>
</div>


<!-- First Time Login Modal -->
<div class="modal fade" id="fristTimelogin" tabindex="-1" role="dialog" aria-labelledby="ftLoginLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
          <h4 class="modal-title" id="ftLoginLabel"><b>First run</b>: Login access setup</h4>
      </div>
      <div class="modal-body">
          <div class="alert alert-info fade in">
              <div class="bold">Setup your access login information</div>
              You see this form because this is the first time to run the application, 
              Please create your username and password bellow.
          </div>    
          
          <form id="FRloginFRM" class="form-horizontal" role="form">
            <div class="form-group">
              <label for="userName" class="col-sm-2 control-label">Username</label>
              <div class="col-sm-10">
                <input type="text" class="form-control required" id="frUserName" placeholder="Username">
              </div>
            </div>
            <div class="form-group">
              <label for="password" class="col-sm-2 control-label">Password</label>
              <div class="col-sm-10">
                <input type="password" class="form-control required" id="frPassword" placeholder="Password">
              </div>
            </div> 
            <div class="form-group">
              <label for="password" class="col-sm-2 control-label">Confirm</label>
              <div class="col-sm-10">
                <input type="password" equal="#frPassword" class="form-control required" id="frPassword2" placeholder="Confirm the password">
              </div>
            </div>
            <div class="form-group">
              <div class="col-sm-offset-2 col-sm-10">
                <button type="submit" data-loading-text="Saving..." class="btn btn-default">Save Information</button>
              </div>
            </div>
          </form>          
      </div>      
    </div>
  </div>
</div>

<script type="text/javascript" src="js/footer.js"></script>
<script type="text/javascript">    
var enableLogin = <?=$enableLogin ? 'true' : 'false'?>;  
var isLogin = <?=$isLogin ? 'true' : 'false'?>;  
var isSetup = <?=$isSetup ? 'true' : 'false'?>;  
var isAdmin = <?=$isAdmin ? 'true' : 'false'?>;  
</script>
<script type="text/javascript" src="js/dashboard.js"></script>
</div>
</body>
</html>