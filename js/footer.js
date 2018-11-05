/*
 * Powered by Ahmed Elkadrey <www.codesgit.com>
 * v2.1.0 via bootstrip 3.1.1
 * 2014-05-09
 */

$("form").each(function()
{    
    $(this).submit(function()
    {
        var errorsFounds = 0, errorMailsFound = 0, equalsError = 0;
        var focused = false;
        var frm = this;
        $(frm).find(".has-error").removeClass('has-error');        
        $(frm).find(".alert").remove();
        $(frm).find(".glyphicon").remove();
        
        $(this).find(".required").each(function()
        {
            switch(this.tagName)
            {
                case 'INPUT':
                case 'SELECT':
                case 'TEXTAREA':
                    switch(this.type)
                    {
                        case 'text':
                        case 'textarea':
                        case 'password':
                        case 'select':
                            if(this.value == "" || this.value == null) 
                            {
                                if(!focused)
                                {
                                    $(this).focus();
                                    focused = true;
                                }
                                errorsFounds++;
                                if($(this).parents('.form-group:eq(0)').length > 0) $(this).parent().append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>').parents('.form-group:eq(0)').addClass('has-error has-feedback');
                                
                            }
                            
                        break;
                        case 'checkbox':
                            if($(this).prop('checked') == false) 
                            {
                                if(!focused)
                                {
                                    $(this).focus();
                                    focused = true;
                                }
                                errorsFounds++;
                                $(this).parent().append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>').parents('.form-group:eq(0)').addClass('has-error has-feedback');
                            }
                        break;                        
                    }
                    break;
            }

        });
        
        var emailTest = new RegExp(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,6})$/);
        $(this).find(".email").each(function()
        {
            if($(this).val() != "" && emailTest.test($(this).val()) == false)
            {
                if(!focused)
                {
                    $(this).focus();
                    focused = true;
                }
                errorMailsFound++;
                $(this).parent().append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>').parents('.form-group:eq(0)').addClass('has-error has-feedback');
            }
        });
        
        $(this).find("[equal]").each(function()
        {                        
            if($(this).val() != $($(this).attr('equal')).val())
            {
                if(!focused)
                {
                    $(this).focus();
                    focused = true;
                }
                equalsError++;
                $(this).parent().append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>').parents('.form-group:eq(0)').addClass('has-error has-feedback');
            }
        });
        
        if(errorsFounds > 0 || errorMailsFound > 0 || equalsError > 0)
        {
            var msgError = "";
            if(errorsFounds > 0) msgError = 'System found ' + errorsFounds + ' field' + (errorsFounds > 1 ? "s are" : " is") + ' required';
          
            if(equalsError > 0)
            {
                if(msgError) msgError += '<br>';                
                msgError += 'The confirm field is not match';
            } 
            if(errorMailsFound > 0)
            {
                if(msgError) msgError += '<br>';                
                msgError += 'Email format is inncorrect';
            }
            
            $(frm).showErr(msgError);
            gotoContent(frm);
            return false;
        }
        else if(this.submitBack) return this.submitBack();
    });
});


$(".integer").each(function()
{
    $(this).focus(function()
    {
        if($(this).val() == 0) $(this).val("");
        else $(this).select();
    }).keydown(function(e)
    {        
        if((e.keyCode <= 105 && e.keyCode >= 96) || (e.keyCode <= 57 && e.keyCode >= 48) || outKeys(e.keyCode)) return true;
        else return false;
    }).blur(function()
    {
        if(this.value == "") this.value = "0";
    });
});

$(".float").float(1);

$(".tabs a").each(function()
{
    $(this).click(function()
    {
        $(this).parent().find('.selected').removeClass('selected');
        $(this).addClass('selected');
        $(".tabContents .tab").hide();
        $("#"+$(this).attr('id') + "Tab").show();
        location.hash = $(this).attr('id');        
    });
});


if(location.hash != "" && $(".tabs " + location.hash).length > 0) $(".tabs " + location.hash).click();
else $(".tabs a:eq(0)").click();

$(".enableTab").enableTab();

function activeReq()
{
    $(".req").each(function()
    {
        var title = $(this).attr('title');
        if(!title || title == undefined) title = "";
        else title += " - ";
        title += "This field is required !";
        $(this).prepend('<span style="color: orange;">*</span> ').attr('title', title).removeClass('req').addClass('required');
    });
}

$(".viewable").each(function()
{
    var txt = $(this).attr('title');
    if(txt && txt != '' && !$(this).hasClass('inputed'))
    {
        $(this).addClass('inputed').focus(function()
        {
            if($(this).val() == txt) $(this).val('');
        }).blur(function()
        {
            if($(this).val() == '') $(this).val(txt);
        });
        if($(this).val() == '') $(this).val(txt);
    }
});


var $switch = function()
{
    $("button.switch").not(".buttoned").each(function()
    {
        $(this).addClass('buttoned');
        if($(this).hasClass('off'))
        {
            this.val = false;
            $(this).find('input').val('0');
        }
        else
        {
            if(!$(this).hasClass('on')) $(this).addClass('on');
            this.val = true;
            $(this).find('input').val('1');
        }
        
        $(this).click(function()
        {
            if($(this).hasClass('on'))
            {
                $(this).removeClass('on').addClass('off');
                this.val = false;
                $(this).find('input').val('0');
            }
            else
            {
                $(this).removeClass('off').addClass('on');
                this.val = true;
                $(this).find('input').val('1');
            }
            
            return false;
        });
        
        
        
    });
}

$switch();

$(document).ready(function()
{
   window.setTimeout(function()
   {
       $("#topBar").find('[notify]').each(function()
        {
            var notifyCound = parseInt($(this).attr('notify'));
            if(notifyCound && notifyCound != 'NaN' && notifyCound != NaN && notifyCound > 0)
            {
                var id = 'not_' + $(this).attr('id');
                var that = this;
                var notifySound = sounder.add('sounds/notification.mp3');
                $("#topBar").append('<div id="'+id+'" class="notifyIcon">' + notifyCound + '</div>').find('#' + id)
                        .css({'top' : $(this).offset().top + 10, 'left' : $(this).offset().left + 20}).show().animate({top: $(this).offset().top}, 100, function()
                        {
                            sounder.play(notifySound);
                            $(this).animate({top: $(this).offset().top + 20}, 250, function()
                            {
                                $(this).animate({top: $(that).offset().top + 15}, 300);
                            });
                        });
            }
        });
   }, 500); 
});

$(".fileTypes").keyup(function()
{
    if(this.value != '*' || !$(this).hasClass('allAllowed')) 
        this.value = strReplace(['*'], '', this.value); else if($(this).hasClass('allAllowed') && $(this).hasClass('autoAll')) this.value = '*';
    this.value = strReplace([' ', '-', '|', ',', ':'], ';', this.value);
}).blur(function()
{
    $(this).keyup();
});