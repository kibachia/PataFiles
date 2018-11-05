$("#searchType [type=radio]").click(function()
{
    if(!isLogin) return false;
    $("#filesTypes").prop('disabled', ($("#sr_inside_files").prop('checked') === true ? false : true));
    if($("#sr_inside_files").prop('checked') == true) $("#filesTypes").focus();
});

$("#backSearch").click(function()
{
    searchActivation(1);
    $("#searchForm").slideDown('slow');
    $("#searchResults").slideUp('slow');
    $("#brand").find('span').remove();
    $("#searchQuery").focus();
    $("#saveSearchResultsDetails").remove();
});

var selectedFileName = '';
document.getElementById('searchForm').submitBack = (function()
{
    var searching = null;
    var fileName = uTime() + '.' + rand(0, 99);
    $("#searching").on('hide.bs.modal', function()
    {
        searchFinished();        
    }).modal({show: true, keyboard: false, backdrop: 'static'});
    searchActivation(2);
    $("#searchResultsDetails").remove();
    $("#brand").append('<span style="display: inline-block;margin-left: 10px;" class="badge">0</span>');
    $("#searchResultsList").html('');
    $("#searchForm").slideUp('slow');
    $("#searchResults").slideDown('slow');
    $("#searchQuery").select();
    $("#backSearch, #saveSearch").prop('disabled', true);
    
    var searchFor = $("#searchQuery").val();
    $("#searchFor").html(searchFor);
    var q = '&searchQuery=' + searchFor;
    searchFor = searchFor.substr(0, 1) == '*' ? searchFor.substr(2) : searchFor;
    var replacement = new RegExp(escapeRegExp(searchFor), "gi");
    q += '&searchType=' + $("input[name=searchType]:checked").val();
    q += '&searchPath=' + $("#searchIn").val();
    q += '&filesTypes=' + $("#filesTypes").val();
    searching = $.post("index.php", "req=search" + q + '&fileName=' + fileName);
    window.setTimeout(function()
    {
        getJsn();
    }, 1000);
    var lastID = 0; 
    var itemsFound = 0;    
    $("#searching span b, #brand .badge").html(itemsFound);
    function getJsn()
    {        
        if(searching === null) return false;
        $.post("_temp/" + fileName + ".tmp", "", function(res)
        {
            if(res && isJsonText(res))
            {
                var jsn = JSON.parse(res); 
                if(!jsn.filesfound) jsn.filesfound = [];
                if(!jsn.dirsfound) jsn.dirsfound = [];
                itemsFound = jsn.filesfound.length + jsn.dirsfound.length;
                $("#searching span b, #brand .badge").html(itemsFound);
                var html = '';
                var active = 0;
                
                lastID = 0;
                $("#searchResultsList").find('*').remove();
                if(jsn.filesfound && jsn.filesfound != null)
                {
                    for(lastID in jsn.filesfound)
                    {
                        active = active == 1 ? 0 : 1;
                        var itm = jsn.filesfound[lastID];                        
                        if(itm) html += '<tr theType="' + (itm[2]).toUpperCase() + ' file" countInLine="' + (itm[3] ? itm[3] : '') + '" fileName="' + itm[0] + '" class="pointer' + (active == 1 ? ' danger' : ' warning') + '"><td class="fileName ext_' + itm[2] + '">&nbsp;</td><td>' + (itm[0]).replace(replacement, '<span class="mark">' + searchFor + '</span>') + (itm[3] ? ' <span class="mark">(' + itm[3] + ')</span>' : '') + '</td><td>' + itm[1] + '</td></tr>';
                    }
                }
                
                lastID = 0;
                if(jsn.dirsfound && jsn.dirsfound != null)
                {
                    for(lastID in jsn.dirsfound)
                    {
                        active = active == 1 ? 0 : 1;
                        var itm = jsn.dirsfound[lastID];
                        if(itm) html += '<tr theType="folder" fileName="' + itm[0] + '" countInLine="" class="pointer' + (active == 1 ? ' danger' : ' warning') + '"><td class="folder">&nbsp;</td><td>' + (itm[0]).replace(replacement, '<span class="mark">' + searchFor + '</span>') + '</td><td>' + itm[1] + '</td></tr>';
                    }
                }
                $("#searchResultsList").html(html);
                
                
                
                if(jsn.status == 0) 
                {                    
                    getJsn();
                }
                else 
                {
                    searching = null;
                    $("#searching").modal('hide');
                }
            }
            else getJsn();
        }).fail(function() {
            getJsn();
        });
    }
    
    function searchFinished()
    {
        $("#backSearch").prop('disabled', false);
        if(itemsFound > 0) $("#saveSearch").prop('disabled', false);
        if(searching) 
        {
            searching.abort();
            if(fileName) $.post('_temp/abort.php', 'file=' + fileName);
        }
        
        var html = '';
        $("#searchResultsDetails").remove();
        if(itemsFound > 0) 
        {
            html = '<div class="alert alert-success fade in" id="searchResultsDetails">System found ' + itemsFound + ' items</div>';
            selectedFileName = fileName;
        }
        else 
        {
            html = '<div class="alert alert-warning fade in" id="searchResultsDetails">No Items found !</div>';
            selectedFileName = '';
        }
        
        $("#searchResults").prepend(html);
        $("#searchResultsDetails").popover('show');
        
        $("#searchResultsList").find('tr').each(function()
        {
            $(this).click(function()
            {
               $("#showInLine").hide();
               $("#fileResultDetails tr:eq(0) td").html($(this).attr('fileName'));
               $("#fileResultDetails tr:eq(1) td").html($(this).attr('theType'));
               $("#fileResultDetails tr:eq(2) td").html($(this).find('td:eq(2)').html());
               
               if($(this).attr('theType') != 'folder') $("#downloadFile").show();
               else $("#downloadFile").hide();
               
               if($(this).attr('countInLine') != '') $("#showDeitalsLine").show();
               else $("#showDeitalsLine").hide();
               
               $("#fileResultDetails").modal('show'); 
            });
        });
        
        searching = null;
    }
    return false;
});

$("#saveSearch").click(function()
{
    saveSearchResults();
});

function saveSearchResults(title)
{
    if(selectedFileName !== '')
    {
        $("#saveSearchResultsDetails").remove();
        var fileName = window.prompt('Search result title', title ? title : '');
        if(fileName && fileName != '')
        {            
            $.post('index.php', 'req=saveResult&file=' + selectedFileName + '&fileName=' + fileName, function(res)
            {
                var html = '';
                if(res && isObject(res))
                {
                    if(res.status === true) 
                    {
                        html = '<div class="alert alert-success fade in" id="saveSearchResultsDetails"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Result Saved successfully !</div>';
                        $("#saveSearch").prop('disabled', true);
                    }
                    else if(res.status === false)
                    {
                        html = '<div class="alert alert-danger fade in" id="saveSearchResultsDetails"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Saved name already exists !</div>';
                        saveSearchResults(fileName);
                    }
                    else html = '<div class="alert alert-danger fade in" id="saveSearchResultsDetails"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Search result has expired !</div>';
                    $("#searchResults").prepend(html);
                }
            });
        }
    }
}

$("#downloadFile").click(function()
{
    window.open('index.php?download=' + $("#fileResultDetails tr:eq(2) td").html() + $("#fileResultDetails tr:eq(0) td").html(), '_blank');
});
$("#showDeitalsLine").click(function()
{
    $("#downloadFile").prop('disabled', true);
    $("#showDeitalsLine").button('loading');
    $.post('index.php', 'req=showInLine&searchQuery=' + $("#searchFor").html() + '&file=' + $("#fileResultDetails tr:eq(2) td").html() + $("#fileResultDetails tr:eq(0) td").html(), function(res)
    {
        if(res && isObject(res) && isArray(res.data))
        {
            var searchFor = $("#searchFor").html();
            var replacement = new RegExp(escapeRegExp(searchFor), "gi");
            var html = "";
            for(var code in res.data)
            {
                html += '<table class="table table-bordered breakers">';
                for(var line in res.data[code])
                {
                    var dtls = res.data[code][line];
                    html += '<tr class="' + (dtls[2] ? 'warning bolder' : 'active') + '"><td style="width: 20px;">' + dtls[0] + '</td>';
                    html += '<td>'+ (dtls[2] && dtls[1] ? (dtls[1]).replace(replacement, '<span class="mark">' + searchFor + '</span>') : dtls[1]) +'</td></tr>';
                }
                html += '</table>';
            }
            
            $("#showInLine").html(html).slideDown();
            $("#showDeitalsLine").fadeOut();
            $("#downloadFile").prop('disabled', false);
            $("#showDeitalsLine").button('reset');
        }
    });
});

document.getElementById('FRloginFRM').submitBack = function()
{
    if($("#frUserName").val() === '' || $("#frPassword").val() === '' || isLogin) return false;
    $("#frUserName").prop('disabled', true);
    $("#frPassword").prop('disabled', true);
    $(this).find("[type=submit]").button('loading');

    var frm = this;
    $.post("index.php", "req=createUser&username=" + $("#frUserName").val() + "&password=" + $("#frPassword").val(), function(res)
    {
        if(res && isObject(res))
        {
            if(res.status === true)
            {
                isLogin = false;
                isSetup = true;
                $("#fristTimelogin").modal('hide');                
            }
            else
            {
                isLogin = false;
                isSetup = false;
                $(frm).showErr("<b>Error !</b> Can't Edit the config.php file.");
            }
            $("#frUserName").prop('disabled', false).val('');
            $("#frPassword").prop('disabled', false).val('');
            $(frm).find("[type=submit]").button('reset');

            searchActivation();
        }
    });
    return false;
};

document.getElementById('loginFRM').submitBack = (function()
{        
    if($("#userName").val() === '' || $("#password").val() === '' || isLogin) return false;
    $("#userName").prop('disabled', true);
    $("#password").prop('disabled', true);
    $(this).find("[type=submit]").button('loading');

    var frm = this;
    $.post("index.php", "req=login&u=" + $("#userName").val() + "&p=" + $("#password").val(), function(res)
    {
        if(res && isObject(res))
        {
            if(res.status === true)
            {
                isLogin = true;
                isAdmin = res.admin;
                $("#searchIn").val(res.dir);
                $("#login").modal('hide');
            }
            else
            {
                isLogin = false;
                $(frm).showErr("Error Username or Password !");
            }
            $("#userName").prop('disabled', false).val('');
            $("#password").prop('disabled', false).val('');
            $(frm).find("[type=submit]").button('reset');

            searchActivation();
        }
    });
    return false;
});   

$("#logout").msgBox('Logout system !', "You're going to logout, Do you want to continue ?", {type: 'yesNo',onYes: function(close)
{
    $.post('index.php','req=logout', function()
    {
        close();
        isLogin = false;
        searchActivation();            
    });
}});   
$("#loginBtn").click(function()
{
    $('#login').modal({show: true, keyboard: false, backdrop: 'static'});
});
$(".modal .scroll").css('height', $(document).height() / 2);
function searchActivation(forceChangeStatus)
{
    if((!forceChangeStatus && isLogin) || forceChangeStatus == 1)
    {
        $("#searchForm").find(':disabled').prop('disabled', false);
        $("#searchType [type=radio]:eq(0)").click();
        $("#filesTypes").prop('disabled', true);
        if(enableLogin) $("#logout").fadeIn();
        else $("#logout").hide();
        if(isAdmin) $("#mangeUsers").fadeIn();
        else $("#mangeUsers").hide();
        $("#loginBtn").hide();
        $("#savedResults").fadeIn();
        if(!forceChangeStatus) $('#login').modal('hide');
    }
    else if((!forceChangeStatus && !isLogin) || forceChangeStatus == 2)
    {
        $("#searchForm").find('input, button').prop('disabled', true);
        if(!forceChangeStatus) 
        {
            $("#savedResults").fadeOut();
            $("#mangeUsers").hide();
            $("#logout").hide();
            $("#loginBtn").show();
            
            $('#' + (isSetup ? 'login' : 'fristTimelogin')).modal({show: true, keyboard: false, backdrop: 'static'});            
        }
    }
}
var browseReq = null;
$("#browse").on('show.bs.modal', function()
{    
    browse();
});
$("#selectDir").click(function()
{
    if($("#browse .table .info").length > 0) $("#searchIn").val($("#browse .table .info:eq(0)").attr('fullPath'));
    else $("#searchIn").val($("#upLevel").attr('thePath'));
    $("#browse").modal('hide');
});

$("#upLevel").click(function()
{
    browse($(this).attr('thePath'), true);
});
function browse(path, up)
{
    if(!path) path = '';
    var brws = $("#browse");
    brws.find(".table").find('*').remove();
    brws.find('#selectDir, #upLevel').prop('disabled', true);
    browseReq = $.post('index.php', "req=browse&rootPath=" + path + (up ? '&options=up' : ''), function(res)
    {
        if(res && isObject(res))
        {
            var dirs = res.dirs;
            
            var html = '';
            $("#upLevel").attr('thePath', res.path);
            if(isArray(dirs) && dirs.length > 0)
            {
                var active = false;
                for(var i in dirs)
                {
                    active = active === true ? false : true;
                    html += '<tr fullPath="' + res.path + dirs[i] + '" class="'+ (active === true ? 'active ' : '') +'pointer"><td style="width: 18px;"><img src="css/images/folder.png" /></td><td>' + dirs[i] + '</td></tr>';
                }
            }
            brws.find('#selectDir, #upLevel').prop('disabled', false);
            $("#browse .table").html(html).find('tr').click(function()
            {
                if($(this).hasClass('info')) $(this).dblclick();
                else
                {
                    brws.find('.table .info').removeClass('info');
                    $(this).addClass('info');
                }
            }).dblclick(function()
            {
                browse($(this).attr('fullPath'));
            });
        }
    });
}

searchActivation();


$("#mangeUsers").click(function()
{
    if(!isAdmin) return false;
    $("#mangeUsersModal").find('.modal-body').html('').addClass('loadingBar');
    $("#mangeUsersModal").modal('show');
    $("#mangeUsersModal").find('input').prop('disabled', true);
    $("#saveUsersChanges").button('loading');
    function addUser(usrName, pasWord, path)
    {
        var htm = '';
        if(!usrName) usrName = '';
        if(!pasWord) pasWord = '';
        if(!path) path = cPath ? cPath : '';
        htm += '<div class="input-group"><input style="height: 34px;width: 50%;" placeholder="Username" value="' + usrName + '" type="text" class="form-control usersNames">';
        htm += '<input style="height: 34px;width: 50%;" placeholder="Password" type="text" " value="' + pasWord + '" class="form-control">';
        htm += '<input style="height: 34px;" placeholder="Specific Directory" type="text" " value="' + path + '" class="form-control"><span onclick="$(this).parent().next().remove();$(this).parent().remove();" class="input-group-addon pointer">&times;</span></div><div class="br"></div>';
        return htm;
    }
    var cPath = '';
    $.post("index.php", "req=getUsers", function(res)
    {
        if(res && isObject(res))
        {
            if(res.admin && isArray(res.admin) && res.admin.length > 0)
            {
                cPath = res.limitAccess;
                var html = '';
                html += '<div class="input-group"><span class="input-group-addon">Admin</span><input style="height: 34px;width: 50%;" id="adminUsername" placeholder="Admin Username" value="' + res.admin[0] + '" type="text" class="form-control required">';
                html += '<input style="height: 34px;width: 50%;" id="adminPassword" placeholder="Admin Password" type="password" " value="' + res.admin[1] + '" class="form-control required"></div><div class="br"></div>';
                
                html += '<div class="panel panel-primary">';
                html += '<div class="panel-heading">Users <input type="button" class="btn btn-success addUsers" style="padding: 5px 10px 5px 10px;" value="+" /></div><div class="panel-body scroll"><div id="usersContents">';
                
                if(res.users && isObject(res.users))
                {
                    for(var name in res.users)
                    html += addUser(name, res.users[name][0], res.users[name][1]);
                }
                
                
                html += '</div><input type="button" class="btn btn-success addUsers" value="Create new user" /></div></div>';
                
                $("#mangeUsersModal").find('.modal-body').html(html).removeClass('loadingBar').find('.addUsers').click(function()
                {
                    $("#mangeUsersModal").find('#usersContents').append(addUser()).parent().scrollTop($("#mangeUsersModal").find('#usersContents').height()).find('.usersNames:last').focus();
                });
                $("#mangeUsersModal .scroll").css('height', ($(document).height() / 2) - 100);
            }
            else
            {
                $("#mangeUsersModal").find('.modal-body').html('').removeClass('loadingBar').showErr('Cannot find users details on $config.php !', true);
            }
            $("#mangeUsersModal").find('input').prop('disabled', false);
            $("#saveUsersChanges").button('reset');
        }
    });
});

$("#saveUsersChanges").click(function()
{
    var adminU = $("#mangeUsersModal").find('#adminUsername').val();
    var adminP = $("#mangeUsersModal").find('#adminPassword').val();
    if(adminU === '' || adminP === '')
    {
        $("#mangeUsersModal").find('.modal-body').showErr('Admin Username and Password are required !');
        return false;
    }
    
    var parms = '';
    parms += '&adminDetails[username]=' + adminU;
    parms += '&adminDetails[password]=' + adminP;
    $('#usersContents').find('.usersNames').each(function()
    {
        if($(this).val() !== '')
        {
            parms += '&users[]=' + $(this).val();
            parms += '&passwords[]=' + $(this).next().val();
            parms += '&access[]=' + $(this).next().next().val();
        }
    });
    $("#mangeUsersModal").find('input').prop('disabled', true);
    $("#saveUsersChanges").button('loading');
    $.post('index.php', 'req=setUsers' + parms, function()
    {
        $("#mangeUsersModal").modal('hide');
    });
});

$("#savedResults").click(function()
{
    if(!isLogin) return false;
    $("#savedResultsModal").find('.modal-body').html('').addClass('loadingBar');
    $("#savedResultsModal").modal('show');
    $.post("index.php", "req=savedResult", function(res)
    {
        if(res && isObject(res))
        {
            if(res.savedFiles && isArray(res.savedFiles) && res.savedFiles.length > 0)
            {
                var html = '';
                html += '<div class="list-group">';
                for(var i in res.savedFiles)
                {
                    
                    html += '<a class="list-group-item pointer"><div class="del">&times;</div><div fileName="' + res.savedFiles[i][0] + '"><b>' + res.savedFiles[i][1] + '</b> <small>' + res.savedFiles[i][2] + '</small></div></a>';                   
                }
                 html += '</div>';
                $("#savedResultsModal").find('.modal-body').removeClass('loadingBar').html(html).find('a').each(function()
                {
                    $(this).find('div:eq(0)').map(function()
                    {
                        var that = this;
                        $(this).msgBox('Delete Saved File', "You're going to delete this file, Do you want to continue ?", {onYes:function(close)
                        {
                                $.post('index.php', 'req=delSavedFile&file=' + $(that).next().attr('fileName'), function(res)
                                {
                                    if(res && isObject(res))
                                    {
                                        if(res.fileStatus === true)
                                        {
                                            $(that).parent().addClass('list-group-item-warning').fadeOut('slow', function()
                                            {
                                                $(this).remove();
                                            });
                                        }
                                        else $("#savedResultsModal").find('.modal-body').showErr("<b>Error!</b> Cannot Delete the file.");
                                    }
                                });
                                close();
                        }})
                    });
                    $(this).find('div:eq(1)').click(function()
                    {
                        $("#backSearch").click();
                        $(this).addClass('loadingIcon').parent().addClass('list-group-item-warning');
                        var that = this;
                        var fileName = $(this).attr('fileName');
                        var itemsFound = 0;
                        
                        $.post("_temp/" + fileName, "", function(res)
                        {
                            if(res && isJsonText(res))
                            {
                                
                                searchActivation(2);
                                $("#searchResultsDetails").remove();
                                $("#brand").append('<span style="display: inline-block;margin-left: 10px;" class="badge">0</span>');
                                $("#searchResultsList").html('');                        
                                $("#saveSearch").prop('disabled', true);
                                
                                var jsn = JSON.parse(res); 
                                if(!jsn.filesfound) jsn.filesfound = [];
                                if(!jsn.dirsfound) jsn.dirsfound = [];
                                
                                var searchFor = jsn.searchQuery ? jsn.searchQuery : "";
                                $("#searchFor").html(searchFor);
                                searchFor = searchFor.substr(0, 1) == '*' ? searchFor.substr(2) : searchFor;
                                var replacement = new RegExp(escapeRegExp(searchFor), "gi");
                                
                                itemsFound = jsn.filesfound.length + jsn.dirsfound.length;
                                 
                                $("#searching span b, #brand .badge").html(itemsFound);
                                var html = '';
                                var active = 0;

                                var lastID = 0;
                                $("#searchResultsList").find('*').remove();
                                if(jsn.filesfound && jsn.filesfound != null)
                                {
                                    for(lastID in jsn.filesfound)
                                    {
                                        active = active == 1 ? 0 : 1;
                                        var itm = jsn.filesfound[lastID];                        
                                        if(itm) html += '<tr theType="' + (itm[2]).toUpperCase() + ' file" countInLine="' + (itm[3] ? itm[3] : '') + '" fileName="' + itm[0] + '" class="pointer' + (active == 1 ? ' danger' : ' warning') + '"><td class="fileName ext_' + itm[2] + '">&nbsp;</td><td>' + (searchFor != "" ? (itm[0]).replace(replacement, '<span class="mark">' + searchFor + '</span>') : itm[0]) + (itm[3] ? ' <span class="mark">(' + itm[3] + ')</span>' : '') + '</td><td>' + itm[1] + '</td></tr>';
                                    }
                                }

                                lastID = 0;
                                if(jsn.dirsfound && jsn.dirsfound != null)
                                {
                                    for(lastID in jsn.dirsfound)
                                    {
                                        active = active == 1 ? 0 : 1;
                                        var itm = jsn.dirsfound[lastID];
                                        if(itm) html += '<tr theType="folder" fileName="' + itm[0] + '" countInLine="" class="pointer' + (active == 1 ? ' danger' : ' warning') + '"><td class="folder">&nbsp;</td><td>' + (searchFor != "" ? (itm[0]).replace(replacement, '<span class="mark">' + searchFor + '</span>') : itm[0]) + '</td><td>' + itm[1] + '</td></tr>';
                                    }
                                }
                                $("#searchResultsList").html(html).find('tr').each(function()
                                {
                                    $(this).click(function()
                                    {
                                       $("#showInLine").hide();
                                       $("#fileResultDetails tr:eq(0) td").html($(this).attr('fileName'));
                                       $("#fileResultDetails tr:eq(1) td").html($(this).attr('theType'));
                                       $("#fileResultDetails tr:eq(2) td").html($(this).find('td:eq(2)').html());

                                       if($(this).attr('theType') != 'folder') $("#downloadFile").show();
                                       else $("#downloadFile").hide();

                                       if($(this).attr('countInLine') != '') $("#showDeitalsLine").show();
                                       else $("#showDeitalsLine").hide();

                                       $("#fileResultDetails").modal('show'); 
                                    });
                                });
                                
                                $("#searchForm").slideUp('slow');
                                $("#searchResults").slideDown('slow');
                                $("#savedResultsModal").modal('hide');
                            }
                            else $("#savedResultsModal").find('.modal-body').showErr("<b>Error!</b> Cannot open the file.");
                            
                            $(that).removeClass('loadingIcon').parent().removeClass('list-group-item-warning');
                        }).fail(function() {
                            $("#savedResultsModal").find('.modal-body').showErr("<b>Error!</b> Cannot open the file.");
                            $(that).removeClass('loadingIcon').parent().removeClass('list-group-item-warning');
                        });
                    });
                });
            }
            else
            {
                $("#savedResultsModal").find('.modal-body').html('').removeClass('loadingBar').showErr('No Saved files found !', true);
            }
        }
    });
});

$(".tooltips").tooltip();