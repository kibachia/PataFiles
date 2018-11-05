/*
 * Functions v3.0.0
 * Elkadrey - codesgit.com
 * 2014-05-04
 */
function luhn_check(number)
{
//<![CDATA[

  // Strip any non-digits (useful for credit card numbers with spaces and hyphens)
  var number=number.replace(/\D/g, '');

  // Set the string length and parity
  var number_length=number.length;
  var parity=number_length % 2;

  // Loop through each digit and do the maths
  var total=0;
  for (i=0; i < number_length; i++) {
    var digit=number.charAt(i);
    // Multiply alternate digits by two
    if (i % 2 == parity) {
      digit=digit * 2;
      // If the sum is two digits, add them together (in effect)
      if (digit > 9) {
        digit=digit - 9;
      }
    }
    // Total up the digits
    total = total + parseInt(digit);
  }

  // If the total mod 10 equals 0, the number is valid
  if (total % 10 == 0) {
    return true;
  } else {
    return false;
  }

//]]>
}

function string_to_int(number)
{
   var number=number.replace(/[^0-9]/g, '');
   return number;
}
function string_to_float(number)
{
   var number=number.replace(/[^0-9\-\.]/g, '');
   return number;
}

function string_to_phone(number)
{
   var number=number.replace(/[^0-9\-\+\/]/g, '');
   return number;
}

function ask(q)
{
    if(q)
    {
        if(!confirm(q))
        {
            return false;
        }
        else
        {
            return true;
        }
    }
}
function goto(url, newWindow)
{
    window.open(url, newWindow ? "_blank" : "_self");
}
function gotothispage(url)
{
    window.setTimeout('goto( "' + url + '");', 1000);
}

function ask_b(q, url)
{
     if(ask(q))
     {
        goto(url);
     }
     else
     {
        return false;
     }
}

function round(num, dec)
{
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}


function gotoContent(element, callBack)
{    
    jQuery('html, body').animate(
    {
          scrollTop: jQuery(element).offset().top,
          scrollLeft: jQuery(element).offset().left
    }, "slow", null, function()
    {
        if(callBack) callBack();
    });
}

function brwStester()
{
    return (document.compatMode && document.compatMode!="BackCompat")? document.documentElement : document.body;
}
    
jQuery.fn.floatButton = function()
{
    var me = this;
    var posissionTop = jQuery(me).offset().top;
    jQuery(me).addClass('fixedCtrl');
    jQuery("#tester").remove();
    jQuery("body").append('<div id="tester" class="fixedCtrl" style="position: fixed"></div>');
    function detect()
    {
        var crntTop = jQuery("#tester").offset().top + jQuery(me).height();   
        if(posissionTop > crntTop) jQuery(me).css('position', 'fixed');
        else jQuery(me).css('position', 'static');
    }
    jQuery(window).scroll(function()
    {
        detect();
    });
    detect();
}

function uTime()
{
    var foo = new Date;
    return parseInt(foo.getTime() / 1000);
}

function time(theUnixTime)
{
    var date = {};
    var today = new Date();
    if(theUnixTime) today.setTime(theUnixTime * 1000);
//    if(today.getTime() >= day.getTime() && today.getTime() < (day.getTime() + (60*60*24*1000)))
//    {
        var hour = today.getUTCHours();
        var meridiem = (hour < 12)? 'AM' : 'PM';
        
        var minutes = (today.getMinutes() < 10)? '0' + today.getMinutes() : today.getMinutes();
        var theHour = (hour < 12)? hour : (hour - 12);
        date.time = theHour + ':' + minutes + meridiem;
        
        date.date = today.getDate() + '/' + (today.getMonth()+1) + '/' + today.getFullYear();
        return date;
//    }
}

function unixTime(date)
{
    if(date)
    {
        var dateData = date.split("-");
        var today = new Date();        
        today.setFullYear(dateData[0], (dateData[1]-1), dateData[2]);
        var theUnixTime = Math.round(today.getTime() / 1000);
        
        return theUnixTime;
    }
}

function stripTags(htmlData)
{    
    return  String(htmlData).replace(/(<([^>]+)>)/ig, "");
}

function strURL(str)
{
    str = stripTags(str);
    str = str.replace(/\s/g, "_")
    return str.toLowerCase();
}

function setVal(c_name,value,exdays)
{
    if(!exdays) exdays = 365; //year
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function getVal(c_name)
{    
    var cookies = unescape(document.cookie);
    var i,x,y,ARRcookies=cookies.split(";");
    for (i=0;i<ARRcookies.length;i++)
    {
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x==c_name)
        {
            return unescape(y);
        }
    }
}

function isSet(i)
{
    if(i != null && i && i != "undefined" && i != "" && i != undefined) return true;
}

function isArray(i)
{
    if(i && i != "undefined" && i != undefined) if(i instanceof Array) return true;
}

function isObject(i)
{
    if(i && i != "undefined" && i != undefined) if(i instanceof Object) return true;
}

function isString(i)
{
    if(i && i != "undefined" && i != undefined) if(typeof i == "string" || typeof i == "STRING") return true;
}
function isFunction(functionToCheck) 
{
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
function getObjData(obj, space)
{
    if(!space) space = "";
    var res = "";
    for(var i in obj)
    {
        var o = obj[i];
        if(isObject(o) || isArray(o))
        {
            res += space + i + "=>\n" + space + "     {\n" + getObjData(o, space + "     ") + space + "     }\n";
        }
        else res += space + i + "=>" + o + "\n";
    }
    
   return res;
}

function fetchAlert(obj)
{
    if(isObject(obj) || isArray(obj))
    {
        alert(getObjData(obj));
    }
    else alert(obj);
}

function inArray(val, arr)
{
    return arr.indexOf(val) > -1 ? true : false;
}

function outKeys(keyCode)
{
    switch(keyCode)
    {
        case 8:
        case 37:
        case 38:
        case 39:
        case 40:
        case 46:
        case 116:
            return true;
            break;
        default:
            return false;
    }
}
function isJsonText(contents)
{    
    return contents && contents.substr(0, 1) == "{" && contents.substr(contents.length - 1, 1) == "}" ? true : false;
}
function json(url, post, callback)
{
    jQuery.post(url, post, function(res)
    {
        if(isJsonText(res))
        {
            if(callback) callback(JSON.parse(res));
        }
        else return false;
    });
}
function escapeRegExp(string) 
{
    return isString(string) ? string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1") : string;
}
function strReplace(oldStr, newStr, str)
{
    if(isArray(oldStr))
    {        
        for(var i in oldStr)
        {
            var rpl = oldStr[i];
            var patt = new RegExp(escapeRegExp(rpl), 'g');
            str = str.replace(patt, (isArray(newStr) ? newStr[i] : newStr));
        }
        return str;
    }
    else 
    {
        var patt = new RegExp(oldStr,'g');
        return str.replace(patt, newStr);
    }
}
function explode(spliter, str)
{
    return str.split(spliter);
}
function implode(spliter, arr)
{
    var text = "";
    if(isArray(arr))
    {        
        if(!spliter) spliter = ","; 
        for(var i in arr)
        {
            if(text != "") text += spliter;
            text += arr[i];
        }
    } 
    return text;
}
function checkifIP(theText)
{
    if(theText.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i)) return true;
    if(theText.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.\*$/i)) return true;
    if(theText.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.\*$/i)) return true;
    if(theText.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.\*jQuery/i)) return true;        
    else return false;
}

function imageReader(srcName, fileData) 
{
    if (srcName && fileData) 
    {
        var reader = new FileReader();

        reader.onload = function (e) 
        {
            jQuery(srcName).attr('src', e.target.result);
        }

        reader.readAsDataURL(fileData);
    }
}

function checkBrowser() 
{
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0)      // If Internet Explorer, return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))) < 10 ? false : true;
    else                 // If another browser, return 0
        return true;

    return false;
}

function repeat(format, limits, startFrom)
{
    var txt = "";
    if(!startFrom) startFrom = 1;
    for(var i = startFrom; i <= limits; i++)
    {
        txt += format;
    }
    return txt;
}

function esc(str)
{
    str = str.replace(/\+/g, '[||||]').replace(/&/g, '[|and|]');    
    return str;
}
function clearSelection() 
{
    if(document.selection && document.selection.empty) {
        document.selection.empty();
    } else if(window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
    }
}

function rand(from, to)
{
    return Math.floor(Math.random(from) * to);
}