var messages={
  'register_successful_validation_required':'Registration successful. Check <b>%email%</b> and confirm your email address.',
  'mail_not_valid' : 'This email address is not valid.',
  'required_field_empty' : 'This field is required.',
  'input_too_short' : 'The input is too short.',
  'input_not_match' : 'The inputs have to match.',
  'send_password_success' : 'We have sent an email to <b>%email%</b> with a link to reset your password.',
  'unkown_social_account' : 'Login failed. Please check if you are using the right social account. If you want to use another account, please log out first at your social provider\'s website.',
  'invalid_user_password' : 'Login failed. Please check your email address and password and try again.',
  'logged_in_but_unknown' : 'You are logged in with a <b>%provider%</b> account that does not have access to this instance!',
  'server_error' : 'There was an error during the login process. Please try again.'
};

$(window).on("load",function(){$('img').animate({'opacity':1},500);});
$(window).on("unload", function(e){if('debug' in window) localStorage.setItem('paeDebug',window.debug);});


$.getJSON('/api/public/auth0.htm').done(function(auth0data){

  var getArgs = parseGet();

  var selfhost=location.protocol+'//'+location.host;


  var output = function(level,msg,header){
    var levels = {
      'error':'alert-danger',
      'warning':'alert-warning',
      'success':'alert-success',
      'info':'alert-info'
    };
    if(level in levels) level=levels[level];
    else level='alert-info'
    $('#output').html(msg)[0].className='alert '+level;
  }

  var loginUrl = getArgs['loginurl']?selfhost+getArgs['loginurl'].replace(/\/\//g,'/'):selfhost;

  var config = {
    Domain: auth0data.domain,
    ClientId: auth0data.id,
    Database: 'Paessler',
    Audience: '', //'https://'+config.Domain+'/api/v2/',
    
    silentCallback:selfhost+'/public/sso.silentCallback.htm',
    hideLogin: true,
    outputFunction: output,
    selfhost: selfhost,
    messages: messages,
    showForm: showLogin.bind(null,1),
    hideForm: showLogin.bind(null,0),
    afterLoginUrl: loginUrl,
    pre: getArgs['t'] || null,
    userinput: '#username',
    passinput: '#password',
    debug: JSON.parse(localStorage.getItem('paeDebug')) || null
    
  };

  // var errorOutput = function(head,body){
  //   if(config.resultElement) $(config.resultElement).html(body).hide();
  //   if(config.errorElement) .show();
  // }

  // var successOutput = function(head,body){
  //   if(config.errorElement) $(config.errorElement).html(body).hide();
  //   if(config.resultElement) $(config.resultElement).html(body).show();
  // }


  var cleanUpForm=function(values){
    $(config.errorElement).hide();
    $(config.resultElement).hide();
    $('.has-error').removeClass('has-error');
    $('.alert.alert-danger').html('').hide();
    $('.alert.alert-success').html('').hide();
    if(values){
      $('#username').val('');
      $('#password').val('');
      $('#password2').val('');
    }
  }

  // if(getArgs['email'] || getArgs['username']){
  //   $('#username').val(getArgs['email'] || getArgs['username']);
  //   $('#social_logins').hide();
  // }

  if(!getArgs['t']) $('#social_logins').show();

  var pa = new paeAuth(config,auth0,'Auth0' in window?Auth0:null);

  if(getArgs['logout']==1){
    $('body').addClass('logout');
    pa.logout();
  }else{
     pa.init();
  }

  if(getArgs['invite']){
    $('#btn-login').hide();
    $('.reset-password').hide();
  }else{
    $('#btn-register').hide();
    $('#password2').parent().hide();
  }

  $('input:first').focus();

  // $('.form-group:visible input:first').addClass('first-input');
  // $('.form-group:visible input:last').addClass('last-input');

  $('#password,#password2,#username').keypress(function(e){
    if(e.which==13) $('#btn-login').click();
  });
  
  $('#btn-login').click(validate(function(){
    cleanUpForm();
    pa.login($('#username').val(),$('#password').val());
  }))

  $('#btn-register').click(validate(function(){
    pa.register($('#username').val(),$('#password').val());
  }))

  $('#facebook,#google,#windows,#amazon').click(function(){
    cleanUpForm(1);
    pa.socialLogin(this.id);
  });

  $('#popup_click a').click(pa.loginWithSSOData);

  $('#resetpw').click(validate('scope_resetpw',function(){
    $('#resetpw').prop('disabled', true);
    pa.resetPassword($('#username').val());
    setTimeout(function(){
      $('#resetpw').prop('disabled', false);
    },5000);
  }));

  function parseGet(){
    var args={};
    var qs=location.search.substr(1).split('#').shift().split('&');
    $.each(qs,function(k,v){
      v=v.split('=');
      if(v.length==2) args[v[0]]=unescape(v[1]);
      else if(v.length>2) args[v.shift()]=unescape(v.join('='));
    });
    return args;
  }

  function showLogin(on){
    $('#popup_click').hide();
    // $('#loginMain').removeClass(on?'out':'in').addClass(on?'in':'out');
    $('#loader').removeClass(on?'in':'out').addClass(on?'out':'in');
    
    if(on) $('#username').focus();
  }

  var email_regexp=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  function validate_email(errElements,scope){
    $('input[type="email"]'+(scope?'.'+scope:'')).each(function(){
      if($(this).val() && !email_regexp.test($(this).val())) errElements.push([$(this).parent(),'mail_not_valid']);
    }); 
    return errElements;
  }

  function validate_required(errElements,scope){
    $('input[required]:visible'+(scope?'.'+scope:'')).each(function(){
      if($(this).val()=='') errElements.push([$(this).parent(),'required_field_empty']);
      else if($(this).val().length < $(this).data('minlength')) errElements.push([$(this).parent(),'input_too_short']);
    });
    return errElements;
  }

  function validate_match(errElements,scope){
    $('input[data-match]:visible'+(scope?'.'+scope:'')).each(function(){
      if($(this).val() != $($(this).data('match')).val()){
        errElements.push([$(this).parent(),'input_not_match']);
         errElements.push([$($(this).data('match')).parent(),'input_not_match']);
      }
    });
    return errElements;
  }

  function validate(){

    var fn,scope=null;
    arguments.length==2 && (scope=arguments[0]) && (fn=arguments[1]) || arguments.length==1 && (fn=arguments[0]);

    return function(){

      var errElements=[];

      $('.has-error').removeClass('has-error');
      $('.alert.alert-danger').html('').hide();
      $('.alert.alert-success').html('').hide();

      errElements=validate_email(errElements,scope);
      errElements=validate_required(errElements,scope);
      errElements=validate_match(errElements,scope);

      $(errElements).each(function(){
        this[0].addClass('has-error');
        
        var errBox = this[0].find('.alert.alert-danger');

        if(!errBox.length){
           errBox=$('<div class="alert alert-danger">');
           this[0].append(errBox);
        }

        errBox.html((errBox.html()+'\n'+messages[this[1]]).trim().replace(/\n/g,'<br>')).show();
      });

      if(!Object.keys(errElements).length) fn();
    }
  }

  $('.showpass').click(function(){
      var show = !$(this).data().show;

      if(show){
        $(this).parent().find('input').prop('type','text').focus();
        $(this).removeClass('fa-eye').addClass('fa-eye-slash');
      }else{
        $(this).parent().find('input').prop('type','password').focus();
        $(this).removeClass('fa-eye-slash').addClass('fa-eye');
      }
      
      $(this).data('show',show);
  });

});