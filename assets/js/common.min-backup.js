var $ = jQuery;
var $doc = $(document);
var SUPER = Object.create(null);

// reCaptcha Callback
SUPER.reCaptchaverifyCallback = function(response){
    $.ajax({
        type: 'post',
        url: super_common_i18n.ajaxurl,
        data: {
            action: 'super_verify_recaptcha',
            response: response,
        },
        success: function (data) {
            if(data==1){
                $('.super-recaptcha').attr('data-verified',1);
            }else{
                $('.super-recaptcha').attr('data-verified',0);
            }
        }
    }); 
}

// init reCaptcha
SUPER.reCaptcha = function(){
    $('.super-shortcode .super-recaptcha').each(function(){
        var $this = $(this);
        var $form = $this.parents('.super-form:eq(0)');
        var $form_id = $form.find('input[name="hidden_form_id"]').val();
        if($form.length==0){
            $this.html('<i>reCAPTCHA will only be generated and visible in the Preview or Front-end</i>');  
        }
        if($this.data('key')==''){
            $this.html('<i>reCAPTCHA API key and secret are empty, please navigate to:<br />Super Forms > Settings > Form Settings and fill out your reCAPTCHA API key and secret</i>');  
        }else{
            if(typeof $form_id !== 'undefined'){
                $(this).attr('data-form',$form_id);
                $(this).attr('id','super-recaptcha-'+$form_id);
                // For some reason the reCAPTCHA does not work when F5 or CTRL+F5 or the browsers refresh buttons is pressed.
                // The following check if exist functions solves this problem
                var checkExist = setInterval(function() {
                   if(typeof grecaptcha !== 'undefined'){
                        grecaptcha.render('super-recaptcha-'+$form_id, {
                            'sitekey' : $this.data('key'),
                            'callback' : SUPER.reCaptchaverifyCallback,
                            'theme' : 'light'
                        });
                       clearInterval(checkExist);
                   }
                }, 100); // check every 100ms
            }
        }
    });
}

// Barcode generator
SUPER.generateBarcode = function(){
    $('.super-barcode').each(function(){
        var $this = $(this).find('input');
        var $renderer = 'css';
        var $barcode = $this.val();
        var $barcodetype = $this.data('barcodetype');
        var $background = $this.data('background');
        var $barcolor = $this.data('barcolor');
        var $barwidth = $this.data('barwidth');
        var $barheight = $this.data('barheight');
        var $modulesize = $this.data('modulesize');
        var $rectangular = $this.data('rectangular');
        var $quietzone = false;
        if ($this.data('quietzone')==1) $quietzone = true;
        var $settings = {
            output:$renderer,
            bgColor: $background,
            color: $barcolor,
            barWidth: $barwidth,
            barHeight: $barheight,
            moduleSize: $modulesize,
            addQuietZone: $quietzone
        };
        if($rectangular==1){
            $barcode = {code:$barcode, rect:true};
        }
        $this.parent().find('.super-barcode-target').barcode($barcode, $barcodetype, $settings);
    });
}

// init Rating
SUPER.rating = function(){
    $('.super-rating').on('mouseleave',function(){
        $(this).find('.super-rating-star').removeClass('active');
    });
    $('.super-rating-star').on('click',function(){
        $(this).parent().find('.super-rating-star').removeClass('selected');
        $(this).addClass('selected');
        $(this).prevAll('.super-rating-star').addClass('selected');
        var $rating = $(this).index()+1;
        $(this).parent().find('input').val($rating);
    });
    $('.super-rating-star').on('mouseover',function(){
        $(this).parent().find('.super-rating-star').removeClass('active');
        $(this).addClass('active');
        $(this).prevAll('.super-rating-star').addClass('active');
    });
}

// handle Conditional logic
SUPER.conditional_logic = function(){
    
    $('.super-shortcode').each(function(){
        var $wrapper = $(this);
        if($wrapper.hasClass('super-file')){
            var $this = $(this).find('.super-selected-files');
        } else if(($wrapper.hasClass('column')) || ($wrapper.hasClass('super-html'))) {
            var $this = $wrapper;
            var $action = $this.data('conditional_action');
            var $trigger = $this.data('conditional_trigger');
        } else {
            var $this = $(this).find('.super-shortcode-field');
            var $action = $this.parents('.super-shortcode:eq(0)').data('conditional_action');
            var $trigger = $this.parents('.super-shortcode:eq(0)').data('conditional_trigger');
        }
        if(typeof $action !== 'undefined'){
            if($action!='disabled'){
                $wrapper.css('display','block');
                if($action=='show') $wrapper.css('display','none');
                if($trigger=='one'){
                    var $counter = 0;
                    $wrapper.children('.super-conditional-logic').each(function(){
                        var $field = $(this).data('field');
                        var $logic = $(this).data('logic');
                        var $value = $(this).data('value');
                        var $field_value = $('.super-shortcode-field[name="'+$field+'"]').val();
                        if(typeof $field_value !== 'undefined'){
                            if($logic=='equal'){
                                if($field_value==$value){
                                    $counter++;
                                }                            
                            }
                            if($logic=='not_equal'){
                                if($field_value!=$value){
                                    $counter++;
                                }                            
                            }
                            if($logic=='greater_than'){
                                if($field_value>$value){
                                    $counter++;
                                }                            
                            }
                            if($logic=='less_than'){
                                if($field_value<$value){
                                    $counter++;
                                }                            
                            }
                            if($logic=='greater_than_or_equal'){
                                if($field_value>=$value){
                                    $counter++;
                                }                            
                            }
                            if($logic=='less_than_or_equal'){
                                if($field_value<$value){
                                    $counter++;
                                }                            
                            }
                            if($logic=='contains'){
                                if($field_value.indexOf($value) >= 0){
                                    $counter++;
                                }
                            }
                        }
                    });
                    if($counter!=0){
                        $wrapper.css('display','none');
                        if($action=='show') $wrapper.css('display','block');
                    }
                }
                if($trigger=='all'){
                    var $counter = 0;
                    var $total = $wrapper.children('.super-conditional-logic').length;
                    $wrapper.children('.super-conditional-logic').each(function(){
                        var $field = $(this).data('field');
                        var $logic = $(this).data('logic');
                        var $value = $(this).data('value');
                        var $field_value = $('.super-shortcode-field[name="'+$field+'"]').val();
                        if($logic=='equal'){
                            if($field_value==$value){
                                $counter++;
                            }                            
                        }
                        if($logic=='not_equal'){
                            if($field_value!=$value){
                                $counter++;
                            }                            
                        }
                        if($logic=='greater_than'){
                            if($field_value>$value){
                                $counter++;
                            }                            
                        }
                        if($logic=='less_than'){
                            if($field_value<$value){
                                $counter++;
                            }                            
                        }
                        if($logic=='greater_than_or_equal'){
                            if($field_value>=$value){
                                $counter++;
                            }                            
                        }
                        if($logic=='less_than_or_equal'){
                            if($field_value<$value){
                                $counter++;
                            }                            
                        }
                        if($logic=='contains'){
                            if($field_value.indexOf($value) >= 0){
                                $counter++;
                            }
                        }
                    });
                    if($counter==$total){
                        $wrapper.css('display','none');
                        if($action=='show') $wrapper.css('display','block');
                    }
                }
            }
        }
    });
}

// Fade in fields one by one (like a survey)
SUPER.loop_fade = function($next, $duration){
    $next.fadeIn($duration);  
    if(($next.hasClass('super-extra-shortcode')) || ($next.hasClass('hidden'))){
        SUPER.loop_fade($next.next('.super-field'), $duration);  
    }else{
        var $this = $next.children('div').children('input,textarea,select');
        var $validation = $this.data('validation');
        if($validation=='none'){
            var $next = $this.parents('.super-field').next('.super-field');
            SUPER.loop_fade($next, $duration);                
        }
    }
}

// Send the email after a successfull submition
SUPER.complete_submit = function($form,$duration){
    
    if($form.find('input[name="hidden_form_id"]').length == 0) {
        var $form_id = '';
    } else {
        var $form_id = $form.find('input[name="hidden_form_id"]').val();
    }
    var $data = {};
    $data['hidden_form_id'] = { 
        'name':'hidden_form_id',
        'value':$form_id,
        'type':'form_id'
    };
    $form.find('.super-shortcode-field').each(function(){
        var $parent = $(this).parents('.super-shortcode:eq(0)');
        if( ( $(this).parents('.super-shortcode.column').css('display')=='none' )  || ( ( $parent.css('display')=='none' ) && ( !$parent.hasClass('super-hidden') ) ) ) {
            // Exclude conditionally
        }else{
            if($(this).parents('.super-field:eq(0)').hasClass('super-total')){
                $data[$(this).attr('name')] = { 
                    'name':$(this).attr('name'),
                    'value':$(this).val(),
                    'label':$(this).data('email'),
                    'currency':$(this).data('currency'),
                    'exclude':$(this).data('exclude'),
                    'excludeconditional':$(this).data('excludeconditional'),
                    'type':'total'
                };
            }else if($(this).parents('.super-field:eq(0)').hasClass('super-product')){
                $data[$(this).attr('name')] = { 
                    'name':$(this).attr('name'),
                    'value':$(this).val(),
                    'label':$(this).data('email'),
                    'currency':$(this).data('currency'),
                    'price':$(this).data('price'),
                    'exclude':$(this).data('exclude'),
                    'excludeconditional':$(this).data('excludeconditional'),
                    'type':'product'
                };
            }else if($(this).parents('.super-field:eq(0)').hasClass('super-shipping')){
                $data[$(this).attr('name')] = { 
                    'name':$(this).attr('name'),
                    'value':$(this).val(),
                    'label':$(this).data('email'),
                    'currency':$(this).data('currency'),
                    'price':$(this).data('price'),
                    'exclude':$(this).data('exclude'),
                    'excludeconditional':$(this).data('excludeconditional'),
                    'type':'shipping'
                };
            }else if($(this).parents('.super-field:eq(0)').hasClass('super-discount')){
                $data[$(this).attr('name')] = { 
                    'name':$(this).attr('name'),
                    'value':$(this).val(),
                    'label':$(this).data('email'),
                    'currency':$(this).data('currency'),
                    'price':$(this).data('price'),
                    'exclude':$(this).data('exclude'),
                    'excludeconditional':$(this).data('excludeconditional'),
                    'type':'discount'
                };
            }else if($(this).parents('.super-field:eq(0)').hasClass('super-barcode')){
                $data[$(this).attr('name')] = { 
                    'name':$(this).attr('name'),
                    'value':$(this).val(),
                    'label':$(this).data('email'),
                    'barcodetype':$(this).data('barcodetype'),
                    'modulesize':$(this).data('modulesize'),
                    'quietzone':$(this).data('quietzone'),
                    'rectangular':$(this).data('rectangular'),
                    'barheight':$(this).data('barheight'),
                    'barwidth':$(this).data('barwidth'),
                    'exclude':$(this).data('exclude'),
                    'excludeconditional':$(this).data('excludeconditional'),
                    'type':'barcode'
                };
            }else if($(this).hasClass('super-fileupload')){
                var $parent = $(this).parents('.super-field-wrapper:eq(0)');
                var $field = $parent.find('.super-selected-files');                
                var $files = $parent.find('.super-fileupload-files > div');
                $data[$field.attr('name')] = {
                    'label':$field.data('email'),
                    'type':'files',
                    'exclude':$field.data('exclude'),
                    'files':{}};
                $files.each(function(index,file){
                    var file = $(this);
                    $data[$field.attr('name')]['files'][index] = { 
                        'name':$field.attr('name'),
                        'value':file.attr('data-name'),
                        'url':file.attr('data-url'),
                        'thumburl':file.attr('data-thumburl'),
                        'label':$field.data('email'),
                        'exclude':$field.data('exclude'),
                        'excludeconditional':$field.data('excludeconditional'),
                    };
                });
            }else{
                $data[$(this).attr('name')] = { 
                    'name':$(this).attr('name'),
                    'value':$(this).val(),
                    'label':$(this).data('email'),
                    'exclude':$(this).data('exclude'),
                    'excludeconditional':$(this).data('excludeconditional'),
                    'type':'field'
                };
            }
        }
    });
    $.ajax({
        url: super_common_i18n.ajaxurl,
        type: 'post',
        data: {
            action: 'super_send_email',
            data: $data,
            form_id: $form_id,
        },
        success: function (result) {
            var $match = result.match(/<script>/g);
            if($match){
                $form.append(result);
            }else{
                var $result = jQuery.parseJSON(result);
                if($form.find('.super-msg').length){
                    $form.find('.super-msg').remove();
                }
                var $result = jQuery.parseJSON(result);
                if($result.error==true){
                    var $html = '<div class="super-msg error">';
                    if(typeof $result.fields !== 'undefined'){
                        $.each($result.fields, function( index, value ) {
                            $(value+'[name="'+index+'"]').parent().addClass('error');
                        });
                    }                               
                }else{
                    var $html = '<div class="super-msg success">';
                }
                if($result.redirect){
                    window.location.replace($result.redirect);
                }else{
                    $html += $result.msg;
                    $html += '</div>';
                    $($html).prependTo($form);
                    $('html, body').animate({
                        scrollTop: $form.offset().top-200
                    }, 1000);
                    if($result.error==false){
                        $form.find('.super-field, .super-multipart-steps').fadeOut($duration);
                        setTimeout(function () {
                            $form.find('.super-field').remove();
                        }, $duration);
                    }                
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert('Failed to process data, please try again');
        }
    });
}

// File upload handler
SUPER.upload_files = function($this,$form,$data,$duration){
    $form.find('.super-fileupload-files').each(function(){
        if(($(this).parent().children('.super-selected-files').data('minfiles')==0) &&
           ($(this).parent().children('.super-fileupload-files').children('div').length == 0)){
            $(this).parent().children('.super-fileupload').addClass('finished');
        }
    });
    $form.find('.super-fileupload-files > div').each(function(){
        var data = $(this).data();
        data.submit();
    });
    $form.find('.super-fileupload').on('fileuploaddone', function (e, data) {
        var $field = $(this).parent('div').children('input[type="hidden"]');
        $.each(data.result.files, function (index, file) {
            if($field.val()==''){
                $field.val(file.name);
            }else{
                $field.val($field.val()+','+file.name);
            }
        });
        var $value = $field.val();
        var $value = $value.split(',');
        $data[$field.attr('name')] = $field.val();
        if($form.find('.super-fileupload-files > div').length == $value.length){
            $(this).addClass('finished');
        }
    });
    var $interval = setInterval(function() {
        if($form.find('.super-fileupload.finished').length == $form.find('.super-fileupload').length){
            clearInterval($interval);
            $form.find('.super-fileupload').fileupload('destroy');
            setTimeout(function() {
                SUPER.complete_submit( $form, $duration );
            }, 1000);
        }
    }, 1000);
}

// Trim strings
SUPER.trim = function($this) {
    if(typeof $this === 'string'){
        return $this.replace(/^s*(S*(s+S+)*)s*$/, "$1");
    }
}

// Check for errors, validate fields
SUPER.handle_validations = function($this, $validation, $duration) {
    
    /*
    For validations we can set a lot of options.
    However, we only used the most commonly used ones.
    Below is a complete list for all possible validation to use in futurue
    */
    
    /*--- jQuery RegExp for Numbers ---*/

    //select integers only
    var intRegex = '/[0-9 -()+]+$/';   
    //match any ip address
    var ipRegex = 'bd{1,3}.d{1,3}.d{1,3}.d{1,3}b';  
    //match number in range 0-255
    var num0to255Regex = '^([01][0-9][0-9]|2[0-4][0-9]|25[0-5])$';
    //match number in range 0-999 
    var num0to999Regex = '^([0-9]|[1-9][0-9]|[1-9][0-9][0-9])$';
    //match ints and floats/decimals
    var floatRegex = '[-+]?([0-9]*.[0-9]+|[0-9]+)'; 
    //Match Any number from 1 to 50 inclusive
    var number1to50Regex = '/(^[1-9]{1}$|^[1-4]{1}[0-9]{1}$|^50$)/gm'; 

    
    /*--- jQuery RegExp for Validation ---*/
    
    //match email address
    var emailRegex = '^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$'; 
    //match credit card numbers
    var creditCardRegex = '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35d{3})d{11})$'; 
    //match username
    var usernameRegex = '/^[a-z0-9_-]{3,16}$/'; 
    //match password
    var passwordRegex = '/^[a-z0-9_-]{6,18}$/'; 
    //Match 8 to 15 character string with at least one upper case letter, one lower case letter, and one digit (useful for passwords).
    var passwordStrengthRegex = '/((?=.*d)(?=.*[a-z])(?=.*[A-Z]).{8,15})/gm'; 
    //match elements that could contain a phone number
    var phoneNumber = '/[0-9-()+]{3,20}/'; 

    
    /*--- jQuery RegExp for Dates ---*/

    //MatchDate (e.g. 21/3/2006)
    var dateRegex = '/(d{1,2}/d{1,2}/d{4})/gm'; 
    //match date in format MM/DD/YYYY
    var dateMMDDYYYRegex = '^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)dd$'; 
    //match date in format DD/MM/YYYY
    var dateDDMMYYYRegex = '^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)dd$';


    /*--- jQuery RegExp for URLâ€™s ---*/

    //match a url
    //var urlRegex = '/^(https?://)?([da-z.-]+).([a-z.]{2,6})([/w .-]*)*/?$/'; 
    //match a url slug (letters/numbers/hypens)
    var urlslugRegex = '/^[a-z0-9-]+$/'; 
    //match a url string (Fixes spaces and querystrings)
    //var urlRegex = '/(https?://)?([da-z.-]+).([a-z.]{2,6})([/w.-=?]*)*/?/';
    var urlRegex = /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;


    /*--- jQuery RegExp for Domain Names ---*/

    //match domain name (with HTTP)
    var domainRegex = '/(.*?)[^w{3}.]([a-zA-Z0-9]([a-zA-Z0-9-]{0,65}[a-zA-Z0-9])?.)+[a-zA-Z]{2,6}/igm'; 
    //match domain name (www. only) 
    var domainRegex = '/[^w{3}.]([a-zA-Z0-9]([a-zA-Z0-9-]{0,65}[a-zA-Z0-9])?.)+[a-zA-Z]{2,6}/igm'; 
    //match domain name (alternative)
    var domainRegex = '/(.*?).(com|net|org|info|coop|int|com.au|co.uk|org.uk|ac.uk|)/igm'; 
    //match sub domains: www, dev, int, stage, int.travel, stage.travel
    var subDomainRegex = '/(http://|https://)?(www.|dev.)?(int.|stage.)?(travel.)?(.*)+?/igm';


    /*--- jQuery RegExp for Images ---*/

    //Match jpg, gif or png image   
    var imageRegex = '/([^s]+(?=.(jpg|gif|png)).2)/gm'; 
    //match all images
    var imgTagsRegex = '/<img .+?src="(.*?)".+?/>/ig';  
    //match just .png images
    var imgPngRegex = '/<img .+?src="(.*?.png)".+?/>/ig';


    /*--- Other Useful jQuery RegExp Examples ---*/

    //match RGB (color) string
    var rgbRegex = '/^rgb((d+),s*(d+),s*(d+))$/';  
    //match hex (color) string
    var hexRegex = '/^#?([a-f0-9]{6}|[a-f0-9]{3})$/'; 
    //Match Valid hexadecimal colour code
    var hexRegex = '/(#?([A-Fa-f0-9]){3}(([A-Fa-f0-9]){3})?)/gm'; 
    //match a HTML tag (v1)
    var htmlTagRegex = '/^< ([a-z]+)([^<]+)*(?:>(.*)< /1>|s+/>)$/'; 
    //match HTML Tags (v2)
    var htmlTagRegex = '/(< (/?[^>]+)>)/gm'; 
    //match /product/123456789
    var productUrlRegex = '(/product/)?+[0-9]+';  
    //Match Letters, numbers and hyphens
    var lnhRegex = '/([A-Za-z0-9-]+)/gm';  
    //match all .js includes    
    var jsTagsRegex = '/<script .+?src="(.+?.js(?:?v=d)*).+?script>/ig';  
    //match all .css includes
    var cssTagsRegex = '/<link .+?href="(.+?.css(?:?v=d)*).+?/>/ig'; 

    var $error = false;
    $('.super-field.conditional[data-conditionalfield="'+$this.attr('name')+'"]').each(function(){
        if($(this).data('conditionalvalue')==$this.val()){
            $(this).addClass('active');
            $(this).find('select').data('excludeconditional','0');
        }else{
            $(this).removeClass('active');
            $(this).find('select').data('excludeconditional','1');
        }
    });
    if ($validation == 'captcha') {
        $error = true;
    }
    if ($validation == 'numeric') {
        var $regex = /^\d+$/;
        var $float = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/;
        var $value = $this.val();
        if (!$regex.test($value) || !$float.test($value)) {
            $error = true;
        }
    }
    if ($validation == 'empty') {
        if(SUPER.trim($this.val()) == '') {
            $error = true;
        }
    }
    if ($validation == 'email') {
        if (($this.val().length < 4) || (!/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test($this.val()))) {
            $error = true;
        }
    }
    if ($validation == 'phone') {
        var $regex = /^((\+)?[1-9]{1,2})?([-\s\.])?((\(\d{1,4}\))|\d{1,4})(([-\s\.])?[0-9]{1,12}){1,2}$/;
        var $value = $this.val();
        var $numbers = $value.split("").length;
        if (10 <= $numbers && $numbers <= 20 && $regex.test($value)) {
        }else{
            $error = true;
        }
    }
    if ($validation == 'website') {
        var $value = $this.val();
        var pattern = new RegExp(urlRegex);
        if(pattern.test($value)) {
        }else{
            $error = true;
        }
    }    
    var $attr = $this.attr('data-minlength');
    if (typeof $attr !== 'undefined' && $attr !== false) {
        var $text_field = true;
        var $total = 0;
        var $parent = $this.parents('.super-field:eq(0)');
        if($parent.hasClass('super-product')){
            $text_field = false;
            if(parseFloat($this.val()) < parseFloat($attr)){
                $error = true;
            }
        }
        if($parent.hasClass('super-checkbox')){
            $text_field = false;
            var $checked = $parent.find('input[type="checkbox"]:checked');
            $checked.each(function () {
                $total++;
            });
            if($total < $attr){
                $error = true;
            }
        }
        if($parent.hasClass('super-dropdown')){
            $text_field = false;
            var $total = $parent.find('.super-dropdown-ui li.selected:not(.super-placeholder)').length;
            if($total < $attr){
                $error = true;
            }
        }
        if($text_field==true){
            if($this.val().length < $attr){
                $error = true;
            }
        }       
    }
    var $attr = $this.attr('data-maxlength');
    if (typeof $attr !== 'undefined' && $attr !== false) {
        var $text_field = true;
        var $total = 0;
        var $parent = $this.parents('.super-field:eq(0)');
        if($parent.hasClass('super-product')){
            $text_field = false;
            if(parseFloat($this.val()) > parseFloat($attr)){
                $error = true;
            }
        }
        if($parent.hasClass('super-checkbox')){
            $text_field = false;
            var $checked = $parent.find('input[type="checkbox"]:checked');
            $checked.each(function () {
                $total++;
            });
            if($total > $attr){
                $error = true;
            }
        }
        if($parent.hasClass('super-dropdown')){
            $text_field = false;
            var $total = $parent.find('.super-dropdown-ui li.selected:not(.super-placeholder)').length;
            if($total > $attr){
                $error = true;
            }
        }
        if($text_field==true){
            if($this.val().length > $attr){
                $error = true;
            }
        }
    }
    if($error==true){
        SUPER.handle_errors($this, $duration);
        var $index = $this.parents('.super-multipart:eq(0)').index('.super-form:eq(0) .super-multipart');
        $this.parents('.super-form:eq(0)').find('.super-multipart-steps').children('.super-multipart-step:eq('+$index+')').addClass('super-error');
    }else{
        $this.parents('.super-field:eq(0)').children('p').fadeOut($duration, function() {
            $(this).remove();
        });
    }
    
    if($this.parents('.super-multipart:eq(0)').find('.super-field > p').length==0){
        var $index = $this.parents('.super-multipart:eq(0)').index('.super-form:eq(0) .super-multipart');
        $this.parents('.super-form:eq(0)').find('.super-multipart-steps').children('.super-multipart-step:eq('+$index+')').removeClass('super-error');
    }
    
    return $error;
}

// Custom error theme
SUPER.custom_theme_error = function($form, $this){
    if($form.find('input[name="hidden_theme"]').length != 0){
        var $theme_options = $form.find('input[name="hidden_theme"]').data();
        $this.attr('style', 'background-color:'+$theme_options['error_bg']+';border-color:'+$theme_options['error_border']+';color:'+$theme_options['error_font']);
    }        
}

// Get the error duration (for fades)
SUPER.get_duration = function($form){
    if($form.find('input[name="hidden_duration"]').length == 0){
        var $duration = parseFloat(super_common_i18n.duration);
    }else{
        var $duration = parseFloat($form.find('input[name="hidden_duration"]').val());
    }
    return $duration;
}

// Output errors for each field
SUPER.handle_errors = function($this, $duration){
    var $error_position = $this.parents('.super-field:eq(0)');
    var $position = 'after';
    if(($error_position.hasClass('top-left')) || ($error_position.hasClass('top-right'))){
        var $position = 'before';
    }
    if ($this.data('message')){
        var $message = $this.data('message');
    }else{
        var $message = 'Field is required.';
    }
    if ($this.parents('.super-field:eq(0)').children('p').length == 0) {
        if($position=='before'){
            $('<p style="display:none;">' + $message + '</p>').insertBefore($this.parents('.super-field-wrapper:eq(0)'));
        }
        if($position=='after'){
            $('<p style="display:none;">' + $message + '</p>').insertAfter($this.parents('.super-field-wrapper:eq(0)'));
        }
    }
    if(($this.parents('.super-field').next('.grouped').length != 0) || ($this.parents('.super-field').hasClass('grouped'))){
        $this.parent().children('p').css('max-width', $this.parent().outerWidth()+'px');
    }
    SUPER.custom_theme_error($this.parents('.super-form'), $this.parent().children('p'));
    $this.parents('.super-field:eq(0)').addClass('error-active');
    $this.parents('.super-field:eq(0)').children('p').fadeIn($duration);
}

// Validate the form
SUPER.validate_form = function($this){
    var $form = $this,
        $data = [],
        $error = false;
    var $duration = SUPER.get_duration($form);
    $form.find('.super-field').find('.super-selected-files').each(function(){
        var $parent = $(this).parents('.super-shortcode:eq(0)');
        if( ( $(this).parents('.super-shortcode.column').css('display')=='none' )  || ( ( $parent.css('display')=='none' ) && ( !$parent.hasClass('super-hidden') ) ) ) {
            // Exclude conditionally
        }else{
            var $this = $(this);
            var $attr = $this.data('minfiles');
            if (typeof $attr !== 'undefined' && $attr !== false) {
                var $total = $this.parent().children('.super-fileupload-files').children('div').length;
                if($total < $attr) {
                    SUPER.handle_errors($this, $duration);
                    $error = true;
                }
            }
            var $attr = $this.data('maxfiles');
            if (typeof $attr !== 'undefined' && $attr !== false) {
                var $total = $this.parent().children('.super-fileupload-files').children('div').length;
                if($total > $attr) {
                    SUPER.handle_errors($this, $duration);
                    $error = true;
                }
            }
            if($error == false){
                $this.parents('.super-field:eq(0)').children('p').fadeOut($duration, function() {
                    $(this).remove();   
                });
            }
        }
    });        
    $form.find('.super-field').find('input, select, textarea').each(function () {
        var $parent = $(this).parents('.super-shortcode:eq(0)');
        if( ( $(this).parents('.super-shortcode.column').css('display')=='none' )  || ( ( $parent.css('display')=='none' ) && ( !$parent.hasClass('super-hidden') ) ) ) {
            // Exclude conditionally
        }else{
            var $this = $(this);
            var $validation = $this.data('validation');
            if (typeof $validation !== 'undefined' && $validation !== false) {
                if (SUPER.handle_validations($this, $validation, $duration)) {
                    $error = true;
                }
            }
        }
    });
    $form.find('.super-field').find('.super-recaptcha').each(function () {
        var $this = $(this);
        if($this.data('verified')!=1){
            if (SUPER.handle_validations($this, 'captcha', $duration)) {
                $error = true;
            }
        }
    });
    if ($error == false) {   
        $form.find('.super-form-button .super-button-name').attr('disabled','disabled').html('<i class="super-loading"></i> Loading...');
        if ($form.find('.super-fileupload-files > div').length != 0) {
            SUPER.upload_files($(this),$form,$data,$duration);
        }else{
            SUPER.complete_submit($form,$duration);
        }
    }else{
        $('html, body').animate({
            scrollTop: $(".super-field > p").offset().top-200
        }, 1000); 
    }
}

// Calculate values for prices etc.
SUPER.FieldCalculator = function(){
    $('.super-form .super-field').each(function(){
        if(($(this).hasClass('super-discount')) || ($(this).hasClass('super-total'))){
            var $index = $(this).index();
            var $total_amount = 0;
            var $form = $(this).parents('.super-form:eq(0)');
            var $fields = $(this).find('.super-shortcode-field').data('fields');
            var $method = $(this).find('.super-shortcode-field').data('method');
            var $percentage = $(this).find('input[type="hidden"]').val();
            if($fields==''){
                if($method=='subtract'){
                    var $counter = 0;
                    $form.find('.super-shortcode-field').each(function(){
                        var $field_index = $(this).parents('.super-field:eq(0)').index();
                        if($index!=$field_index){
                            if(($(this).attr('name')!='hidden_form_id') && (!$(this).parents('.super-barcode:eq(0)').length) && (!$(this).parents('.super-discount:eq(0)').length)){
                                if($(this).parents('.super-product:eq(0)').length==1){
                                    if($counter==0){
                                        $total_amount = $(this).val()*$(this).data('price');
                                    }else{
                                        $total_amount = $total_amount - $(this).val()*$(this).data('price');
                                    }
                                    $counter++;
                                }else{
                                    if($.isNumeric($(this).val())){
                                        if($counter==0){
                                            $total_amount = parseFloat($(this).val());
                                        }else{
                                            $total_amount = $total_amount - parseFloat($(this).val());
                                        }
                                        $counter++;
                                    }
                                }
                            }
                        }
                    });
                }else{
                    $form.find('.super-shortcode-field').each(function(){
                        var $field_index = $(this).parents('.super-field:eq(0)').index();
                        if($index!=$field_index){
                            if(($(this).attr('name')!='hidden_form_id') && (!$(this).parents('.super-barcode:eq(0)').length) && (!$(this).parents('.super-discount:eq(0)').length)){
                                if($(this).parents('.super-product:eq(0)').length==1){
                                    $total_amount = $total_amount + $(this).val()*$(this).data('price');
                                }else{
                                    if($.isNumeric($(this).val())){
                                        $total_amount = $total_amount + parseFloat($(this).val());
                                    }
                                }
                            }
                        }
                    });
                }
            }else{
                if(typeof $fields !== 'undefined'){
                    var $fields = $fields.split(',');
                    if($method=='subtract'){
                        var $counter = 0;
                        $.each($fields, function(key, value){
                            var $field = $form.find('*[name="'+value+'"]');
                            var $field_index = $field.parents('.super-field:eq(0)').index();
                            if($index!=$field_index){
                                if(($field.attr('name')!='hidden_form_id') && (!$field.parents('.super-barcode:eq(0)').length)){
                                    if($field.parents('.super-product:eq(0)').length==1){
                                        if($counter==0){
                                            $total_amount = $field.val()*$field.data('price');
                                        }else{
                                            $total_amount = $total_amount - $field.val()*$field.data('price');
                                        }
                                        $counter++;
                                    }else if($field.parents('.super-discount:eq(0)').length==1){
                                        var $amount = $field.parents('.super-discount:eq(0)').find('.super-amount').text();
                                        if($counter==0){
                                            $total_amount = parseFloat($amount);
                                        }else{
                                            $total_amount = $total_amount - parseFloat($amount);
                                        }
                                        $counter++;
                                    }else{
                                        if($.isNumeric($field.val())){
                                            if($counter==0){
                                                $total_amount = parseFloat($field.val());
                                            }else{
                                                $total_amount = $total_amount - parseFloat($field.val());
                                            }
                                            $counter++;
                                        }
                                    }
                                }
                            }
                        });
                    }else{
                        $.each($fields, function(key, value){
                            var $field = $form.find('*[name="'+value+'"]');
                            var $field_index = $field.parents('.super-field:eq(0)').index();
                            if($index!=$field_index){
                                if(($field.attr('name')!='hidden_form_id') && (!$field.parents('.super-barcode:eq(0)').length)){
                                    if($field.parents('.super-product:eq(0)').length==1){
                                        $total_amount = $total_amount + $field.val()*$field.data('price');
                                    }else{
                                        if($.isNumeric($field.val())){
                                            $total_amount = $total_amount + parseFloat($field.val());
                                        }
                                    }
                                }
                            }                        
                        });
                    }
                }
            }
            if($(this).hasClass('super-discount')){
                var $amount = parseFloat(($total_amount/100) * $percentage).toFixed(2);
                $(this).find('.super-amount').text($amount);
            }else{
                $(this).find('.super-amount').text(parseFloat($total_amount).toFixed(2));
                $(this).find('input[type="hidden"]').val(parseFloat($total_amount).toFixed(2));
            }

        }
    });
    SUPER.conditional_logic();
}

// Checkbox handler
SUPER.checkboxes = function(){
    $('.super-checkbox').each(function(){
        var $value = '';
        var $counter = 0;
        var $checked = $(this).find('input[type="checkbox"]:checked');
        $checked.each(function () {
            if ($counter == 0) $value = $(this).val();
            if ($counter != 0) $value = $value + ', ' + $(this).val();
            $counter++;
        });
        $(this).find('input[type="hidden"]').val($value);
    });
    $('.super-radio, .super-shipping').each(function(){
        var $name = $(this).find('.super-shortcode-field').attr('name');
        $(this).find('input[type="radio"]').attr('name','group_'+$name);
    });
    $('.super-shipping').each(function(){
        if(!$(this).hasClass('html-finished')){
            var $currency = $(this).find('.super-shortcode-field').attr('data-currency');
            $(this).find('input[type="radio"]').each(function(){
                var $html = $(this).parent().html();
                var $value = $(this).val();
                $(this).parent().html($html+'<span class="super-shipping-price"> &#8212; '+$currency+''+parseFloat($value).toFixed(2)+'</span>');
            });
            $(this).addClass('html-finished');
        }        
    });
}

// Handle columns
SUPER.handle_columns = function(){
    var $preload = super_common_i18n.preload;
    $('div.super-field').each(function(){
        var $item = $(this).nextAll(':not(.super-shortcode)');
        if($item.prop("tagName")!='STYLE'){
            $item.remove();
        }
        if($(this).hasClass('grouped')){
            if((!$(this).prev().hasClass('grouped')) || ($(this).prev().hasClass('grouped-end'))){
                $(this).addClass('grouped-start'); 
            }
        }
    });
    var $width = 0;
    $('.super-field > .super-label').each(function () {
        if($(this).parent().index()); 
        if (!$(this).parent().hasClass('grouped')) {
            if ($(this).outerWidth(true) > $width) $width = $(this).outerWidth(true);
        }
    });
    $('.super-form').each(function () {
        var $this = $(this);
        $preload = 0;
        if (!$this.hasClass('active')) {
            if (!$this.hasClass('initialized')) {
                $this.addClass('initialized');
                setTimeout(function (){
                    $this.fadeOut(100, function () {
                        $this.addClass('active').fadeIn(500);
                    });
                }, 1000);
            }
        } else {
            $this.addClass('active');
        }
        //Field calculator (for totals and discounts)
        SUPER.FieldCalculator();
    });
    
    //Checkbox fields
    SUPER.checkboxes();
    
    //Barcodes
    SUPER.generateBarcode();
    
    //Rating
    SUPER.rating();
    
    //reCAPTCHA
    SUPER.reCaptcha();
    
}

// Remove responsive class from the form
SUPER.remove_super_form_classes = function($this, $classes){
    $.each($classes, function( k, v ) {
        $this.removeClass(v);
    });
}

// init the form on the frontend
SUPER.init_super_form_frontend = function(){

    var $ = jQuery;
    
    var $doc = $(document);

    if($('.super-fileupload').length){
        $('.super-fileupload').fileupload({
            dataType: 'json',
            autoUpload: false,
            //acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i, //Allow these file extensions with SUPER
            maxFileSize: $(this).data('file-size')*1000000, // 5 MB
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $(this).parent().children('.super-progress-bar').css('display','block').css('width', progress + '%');
            }        
        }).on('fileuploaddone', function (e, data) {
            $.each(data.result.files, function (index, file) {
                data.context.attr('data-name',file.name).attr('data-url',file.url).attr('data-thumburl',file.thumbnailUrl);
            });
        }).on('fileuploadadd', function (e, data) {
            data.context = $('<div/>').appendTo($(this).parent('div').children('.super-fileupload-files'));
            $.each(data.files, function (index, file) {
                data.context.data(data).attr('data-name',file.name).html('<span class="super-fileupload-name">'+file.name+'</span><span class="super-fileupload-delete">[x]</span>');
            });
        }).on('fileuploadprocessalways', function (e, data) {
            var index = data.index;
            var file = data.files[index];
            if (file.error) {
                $(this).parent('div').children('.super-fileupload-files').find("[data-name='" + file.name + "']").remove();
                alert(file.error);
            }
        }).on('fileuploadfail', function (e, data) {
            $.each(data.files, function (index, file) {
                var error = $('<span class="text-danger"/>').text('File upload failed.');
                $(data.context.children()[index])
                    .append('<br>')
                    .append(error);
            });
        });
    }
    
    //Init popups 
    SUPER.init_tooltips();

    //Set dropdown placeholder
    $('.super-dropdown-ui').each(function(){
        if($(this).children('.super-placeholder').html()==''){
            var $first_item = $(this).children('li:eq(1)');
            $first_item.addClass('selected');
            $(this).children('.super-placeholder').attr('data-value',$first_item.attr('data-value')).html($first_item.html());
        }
    });
   
    $('.super-form').each(function(){
        var $form = $(this);
        var $total = $form.find('.super-multipart').length;
        if($total!=0){
            var $multipart = {}; // my object
            var $multiparts =  []; // my array
            $form.find('.super-multipart:eq(0)').addClass('active');
            $form.find('.super-multipart').each(function(){
                $multipart = {
                    name: $(this).data('step-name'),
                    description: $(this).data('step-description'),
                    icon: $(this).data('icon'),
                }
                $multiparts.push($multipart);
            });
            var $button_clone = $form.children('.super-form-button')[0].outerHTML;
            var $button_html = $form.children('.super-form-button').find('.super-button-name').html();
            var $button_name = $form.children('.super-form-button').find('.super-button-name').text();
            var $button_html = $button_html.replace($button_name, "");
            
            $($button_clone).appendTo($form.find('.super-multipart').not(':first'));
            $($button_clone).appendTo($form.find('.super-multipart'));
            $form.children('.super-form-button').remove();
            $form.find('.super-multipart:not(:last-child)').find('.super-button-name').html($button_html+'Next');
            $form.find('.super-multipart').not(':first').find('.super-button-name:eq(1)').html($button_html+'Prev');
            
            $form.find('.super-multipart').not(':first').not(':last').find('.super-form-button:eq(0)').removeClass('super-form-button').addClass('super-next-multipart');
            $form.find('.super-multipart').not(':first').not(':last').find('.super-form-button').removeClass('super-form-button').addClass('super-prev-multipart');
            $form.find('.super-multipart:first').find('.super-form-button').removeClass('super-form-button').addClass('super-next-multipart');
            $form.find('.super-multipart:last').find('.super-form-button:eq(1)').removeClass('super-form-button').addClass('super-prev-multipart');

            $form.find('.super-multipart').each(function(){
                var $buttons_html = '';
                $(this).find('.super-button-align-center').each(function(){
                    $buttons_html += $(this)[0].outerHTML;
                });
                $(this).find('.super-button-align-center').remove();
                $( '<div class="super-buttons-wrapper">'+$buttons_html+'</div>' ).appendTo($(this));
                //$('<div>'+$buttons_html+'</div>').prepend($(this).find('.super-button-align-center'));
            });
            
            $form.find('.super-multipart:not(:first)').each(function(){
                $(this).find('.super-button-align-center:first').insertAfter($(this).find('.super-button-align-center:last'));
            });
            
            
            var $progress_steps  = '<ul class="super-multipart-steps">';
            $.each($multiparts, function( index, value ) {
                if($total==1){
                    $progress_steps += '<li class="super-multipart-step active last-step">';
                }else{
                    if((index==0) && ($total != (index+1))){
                        $progress_steps += '<li class="super-multipart-step active">';
                    }else{
                        if($total == (index+1)){
                            $progress_steps += '<li class="super-multipart-step last-step">';
                        }else{
                            $progress_steps += '<li class="super-multipart-step">';
                        }
                    }
                }
                $progress_steps += '<span class="super-multipart-step-wrapper">';
                $progress_steps += '<span class="super-multipart-step-icon"><i class="fa fa-'+value.icon+'"></i></span>';
                $progress_steps += '<span class="super-multipart-step-count">'+(index+1)+'</span>';
                $progress_steps += '<span class="super-multipart-step-name">'+value.name+'</span>';
                $progress_steps += '<span class="super-multipart-step-description">'+value.description+'</span>';
                $progress_steps += '</span>';
                $progress_steps += '</li>';
            });
            $progress_steps += '</ul>';
            $form.prepend($progress_steps);

            var $progress = 100 / $total;
            var $progress_bar  = '<div class="super-multipart-progress">';
                $progress_bar += '<div class="super-multipart-progress-inner">';
                $progress_bar += '<div class="super-multipart-progress-bar" style="width:'+$progress+'%"></div>';
                $progress_bar += '</div>';
                $progress_bar += '</div>';
            $form.prepend($progress_bar);
            
        }
    });
    
    SUPER.init_super_responsive_form_fields();

    $(window).resize(function() {
        SUPER.init_super_responsive_form_fields();
    });
    
    var $handle_columns_interval = setInterval(function(){
        if(($('.super-form').length != $('.super-form.active').length) || ($('.super-form').length==0)){
            SUPER.handle_columns();
        }else{
            clearInterval($handle_columns_interval);
        }
    }, 100);
    
}

// Init Slider fields
SUPER.init_slider_field = function(){
    $('.slider-field').each(function () {
        var $this = $(this);
        if($this.children('.slider').length==0){
            var $field = $this.children('input');
            var $steps = $field.data('steps');
            var $min = $field.data('min');
            var $max = $field.data('max');
            $field.simpleSlider({
                snap: true,
                step: $steps,
                range: [$min, $max]
            });
            $field.show();
        }
    });
}

// Init Tooltips
SUPER.init_tooltips = function(){
    if ( $.isFunction($.fn.tooltip) ) {
        $('.popup').tooltip('destroy');
        $('.popup').tooltip({
            html:true
        });
    }
}

// Init color pickers
SUPER.init_color_pickers = function(){
    if ( $.isFunction($.fn.wpColorPicker) ) {
        $('.color-picker').each(function(){
            if($(this).find('.wp-picker-container').length==0){
                $(this).children('input').wpColorPicker({
                    palettes: ['#F26C68', '#444444', '#6E7177', '#FFFFFF', '#000000']
                });
            }
        });
    }
}

// Handle the responsiveness of the form
SUPER.init_super_responsive_form_fields = function(){
    var $classes = [
        'super-first-responsiveness',
        'super-second-responsiveness',
        'super-third-responsiveness',
        'super-fourth-responsiveness',
        'super-last-responsiveness'
    ];

    $('.super-form').each(function(){

        var $this = $(this);
        var $width = $(this).outerWidth(true);

        //@media (min-width: 100px){
        if($width > 0 && $width < 530){
            SUPER.remove_super_form_classes($this,$classes);
            $this.addClass($classes[0]);
            return true;
        }

        //@media (min-width: 530px){  
        if($width >= 530 && $width < 760){
            SUPER.remove_super_form_classes($this,$classes);
            $('.super-form').addClass($classes[1]);
            return true;
        }

        //@media (min-width: 760px){
        if($width >= 760 && $width < 1200){
            SUPER.remove_super_form_classes($this,$classes);
            $this.addClass($classes[2]);
            return true;
        }

        //@media (min-width: 1200px){
        if($width >= 1200 && $width < 1400){
            SUPER.remove_super_form_classes($this,$classes);
            $this.addClass($classes[3]);
            return true;
        }

        //@media (min-width: 1400px){
        if($width >= 1400){
            SUPER.remove_super_form_classes($this,$classes);
            $this.addClass($classes[4]);
            return true;
        }
    });
}

// Update field visibility
SUPER.init_field_filter_visibility = function( $this ) {
    
    if( typeof $this === 'undefined' ) {
        $('.field-container.filter, .field.filter, .super-field.filter').each(function(){
            SUPER.init_field_filter_visibility($(this));
        });
    }else{
        var $field_name = $this.find('.element-field').attr('name');
        var $field_value = $this.find('.element-field').val();
        $('.field[data-parent="'+$field_name+'"], .super-field[data-parent="'+$field_name+'"]').each(function(){
            var $this = $(this);
            var $filtervalue = $this.data('filtervalue');
            var str1 = $filtervalue;
            var str2 = $field_value;
            if(str2==''){
                $this.css('display','none');
            }else{
                if(str1.indexOf(str2) != -1){
                    $this.css('display','block').removeClass('hidden');
                }else{
                    $this.css('display','none').addClass('hidden');
                }
            }
        });
        $('.field-container[data-parent="'+$field_name+'"]').each(function(){
            var $this = $(this);
            var $filtervalue = $this.data('filtervalue');
            var str1 = $filtervalue;
            var str2 = $field_value;
            if(str2==''){
                $this.css('display','none');
            }else{
                if(str1.indexOf(str2) != -1){
                    $this.css('display','block').removeClass('hidden');
                }else{
                    $this.css('display','none').addClass('hidden');
                }
            }
        });
    }
}

jQuery(document).ready(function ($) {
    
    var $doc = $(document);
    
    SUPER.init_field_filter_visibility();
    $doc.on('change','.field-container.filter, .field.filter, .super-field.filter',function(){
        SUPER.init_field_filter_visibility($(this));
    });
        
    $doc.on('keyup', '.super-icon-search input', function(){
        var $value = $(this).val();
        var $icons = $(this).parents('.super-icon-field').children('.super-icon-list').children('i');
        if($value==''){
            $icons.css('display','inline-block');   
        }else{
            $icons.each(function(){
                if($(this).is('[class*="'+$value+'"]')) {
                    $(this).css('display','inline-block');
                }else{
                    $(this).css('display','none');
                }
            });
        }
    });

    $doc.on('click','.super-icon-list i',function(){
        if($(this).hasClass('active')){
            $(this).parent().find('i').removeClass('active');
            $(this).parents('.super-icon-field').find('input').val('');
        }else{
            $(this).parent().find('i').removeClass('active');
            $(this).parents('.super-icon-field').find('input').val($(this).attr('class').replace('fa fa-',''));
            $(this).addClass('active');
        }
    });

    SUPER.init_slider_field();
    SUPER.init_tooltips(); 
    SUPER.init_color_pickers();
    
});