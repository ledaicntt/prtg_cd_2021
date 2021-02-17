//_Prtg.CrumblerSensorStats.js
(function($, window, undefined) {
  var pluginName = 'crumblerSensorStats';

  function Plugin( elements, data, parent  ) {
    this.elements = elements;
    this.$parent = $(parent);
    this._name = pluginName;
    this.id = null;
    this.confirmedGrowls = {};
    this.stats = $.each({
      'alert':{'value':'NewAlarms'},
      'message':{'value':'NewMessages'},
      'newtickets':{'value':'NewTickets'},
      'downsens':{'value':'Alarms'},
      'partialdownsens':{'value':'PartialAlarms'},
      'downacksens':{'value':'AckAlarms'},
      'warnsens':{'value':'WarnSens'},
      'upsens':{'value':'UpSens'},
      'pausedsens':{'value':'PausedSens'},
      'unusualsens':{'value':'UnusualSens'},
      'undefinedsens':{'value':'UnknownSens'}},
      function(i,o) {
        o['element'] = $('.statusinfo.'+i, elements);
        o['text'] = o['element'].find('.counter');
        var t = !!o['element'].attr('title')?'title':'data-original-title';
        t = o['element'].attr(t);
        if(!!t && t.indexOf('x')!==-1)
          o['title'] = 'x'+t.split('x')[1];
      });
    _Prtg.lastStats = {};
    this.init(this);
  }

  Plugin.prototype.init = function(me) {
    $('#new_message', this.elements ).click(function() {
      me.resetnewmessagestimestamp();
      $(this).parent().fadeOut("slow");
      return true;
    });
    $('#new_alarms', this.elements).click(function() {
      me.resetnewmessagestimestamp();
      $(this).parent().fadeOut("slow");
      return true;
    }).effect("pulsate", { times:10 }, 1500 );

    //set menu flyoutleft on window resize
    var resizeMainMenu =  function() {
      var e = $('#main_menu')
        , u = e.find('ul ul')
              .removeClass('flyoutleft')
              .css('bottom','')
        , ww = -100000 + $(window).width()
        , wh = $(window).height();

      u.each(function() {
        var self = $(this);
        var off = self.offset();
        if(off.left % 100000 + self.width() > ww) {
          self.addClass('flyoutleft');
        }
        if(off.top + self.height() > wh) {
          self.css('bottom',0);
        }
      });
      _Prtg.Events.publish('resize.layout');
    };

    $(window).debounce(resizeMainMenu);
    resizeMainMenu();
    $('footer').addClass('hovered').delay(3000).queue(function(){
      $(this).removeClass('hovered').dequeue();
    });

    // better main menu handling
    $('#main_menu ul').not(':has(ul)').css({
      maxHeight: "600px",
      overflowY: "auto",
      overflowX: "hidden"
    });
    $('#main_menu')
    .on('click tap MSPointerDown', 'a', function(e) {
      var ul = $(this).parents('ul:not("#main_menu")');
      if(ul.length) {
        ul.css('visibility','hidden');
        setTimeout(function(){ul.css({'visibility':'','margin-left':''});},150);
      } else {
        ul = $(this).next();
        ul.css('visibility','hidden');
        $(this).parent().on('mouseleave.mainmenu',function() {
          ul.css('visibility','');
          $(this).off('.mainmenu');
        });
      }
    })
    .on({
      mouseleave: function(e) {
        var ul = $(this);
        var uls = ul.parents('ul').andSelf();

        uls.css({'visibility':'visible','margin-left':'0px'});
        ul.data('timer',
          setTimeout(function() {
            uls.css({'visibility':'','margin-left':''});
            ul.removeData('timer');
            $('#header_menu').off('.menu');
          }, 700)
        );
        $('#header_menu').on('mouseenter.menu','#main_menu>li',function(){
          var x = ul.data('timer');
          if(!!x){
            clearTimeout(x);
            uls.css({'visibility':'','margin-left':''});
            ul.removeData('timer');
            $('#header_menu').off('.menu');
          }
        });
      }
    },'ul ul')
    .on({
      mouseenter: function() {
        var x = $(this).data('timer');
        if(!!x) {
          clearTimeout(x);
          $(this).removeData('timer');
          $('#header_menu').off('.menu');
        }
      }
    },'ul');

    $(document).on('click', '', function(){
      $('#main_menu ul').css({'visibility':'','margin-left':''});
    });

    if(_Prtg.Options.refreshType === 'none') $('#footerrefresh').css('visibility', 'hidden');


    _Prtg.Events.subscribe('refresh.events.prtg', $.proxy(crumblerSensorStats,this));
    crumblerSensorStats.call(this);
    function crumblerSensorStats() {
      var me = this;
      $.ajax({
        url: '/api/status.json',
        global: false,
        timeout: 30000,
        dataType: 'json',
        data: {
          asjson: true,
          id: (window.winguiid || me.id || _Prtg.Util.getUrlVars()['id'] || -1)
        },
      }).done(function(s) {
        var mymsg = "";

        if((!!_Prtg.lastStats.hasOwnProperty('ClusterType')
        && _Prtg.lastStats.ClusterType !== s.ClusterType)
        || (!!_Prtg.lastStats.hasOwnProperty('ReadOnlyUser')
        && _Prtg.lastStats.ReadOnlyUser !== s.ReadOnlyUser)) {
          document.location.reload();
          return;
        }

        $('footer .serverclock').text(s.Clock);
        _Prtg.serverTime.setTime(s.jsClock*1000);

        s.Alarms = parseInt(s.Alarms+0, 10)/10;
        ///*IE only supports ICO file format */
        <#system type="browserdependent" browsertype="MSIE" browsercontent="/*">
        if (s.Alarms > 0) {
          Tinycon.setImage('/icons/favicon_red.png')
        } else {
          Tinycon.setImage('/favicon.ico')
        }
        Tinycon.setBubble( s.Alarms );
        <#system type="browserdependent" browsertype="MSIE" browsercontent="*/">

        $.each(me.stats, function(i,o) {
          var txt = s[o['value']] + o['title']
            , attr = (!!o['element'].attr('title') ? 'title' : 'data-original-title');
          if(!!o['title']) o['element'][0].setAttribute(attr, txt);
          o['text'].text(s[o['value']]);
          s[o['value']] = parseInt(0+s[o['value']],10);
          if(s[o['value']] > 0) {
            o['element'].removeClass('display0').show();
          } else {
            o['element'].hide();
          }
        });

        if (parseInt(s.NewAlarms+0, 10) > 0) {
          _Prtg.desktopNotification.showAlarms(s.NewAlarms);
        }
        if (parseInt(s.BackgroundTasks+0, 10) > 0) {
          mymsg += " <a href='/status.htm'>"+s.BackgroundTasks+"x "+_Prtg.Lang.crumbler.strings.CacheCalculation+"</a><br>";
        }
        if (parseInt(s.CorrelationTasks+0, 10) > 0) {
          mymsg += " <a href='/status.htm'>"+s.CorrelationTasks+"x "+_Prtg.Lang.crumbler.strings.CorrelationTask+"</a><br>";
        }
        if (parseInt(s.AutoDiscoTasks+0, 10) > 0) {
          mymsg += " <a href='/status.htm'>"+s.AutoDiscoTasks+"x "+_Prtg.Lang.crumbler.strings.AutoDiscovery+"</a><br>";
        }
        if (parseInt(s.ReportTasks+0, 10) > 0) {
          mymsg += " <a href='/reports.htm'>"+s.ReportTasks+"x "+_Prtg.Lang.crumbler.strings.Reporting+"</a>";
        }
        if (mymsg !== "") {
          _Prtg.Growls.add({
            id: 'backroundtask',
            type: "info",
            title: _Prtg.Lang.crumbler.strings.BackgroundTask,
            message: mymsg,
            time: _Prtg.Options.refreshInterval + 3
          });
        }
        if(s.LowMem) {
          _Prtg.Growls.add({
            id: 'lowmem',
            type: "warning",
            title: _Prtg.Lang.crumbler.strings.Warning,
            message: _Prtg.Lang.crumbler.strings.LowMem,
            time: _Prtg.Options.refreshInterval + 3
          });
        }
        if(s.Overloadprotection==true) {
          _Prtg.Growls.add({
            id: 'overload',
            type: "warning",
            time: _Prtg.Options.refreshInterval * 3,
            title: _Prtg.Lang.crumbler.strings.Warning,
            message: '<a href="https://kb.paessler.com/en/topic/25523?utm_source=prtg&utm_medium=referral&utm_campaign=webgui-kb" target="_blank">'+_Prtg.Lang.crumbler.strings.overload+'</a>'
          });
        }
        if (!!s.ClusterType) {
          $("#clusterstatus").html(s.ClusterNodeName);
          if (s.ClusterType === 'clustermaster') $("clustergrowl").hide();
          if (s.ClusterType === 'failovermaster') {
            _Prtg.Growls.add({
              id: 'clustergrowl',
              type: "warning",
              title: _Prtg.Lang.crumbler.strings.failovermaster1,
              message: '<a href="https://kb.paessler.com/en/topic/7663?utm_source=prtg&utm_medium=referral&utm_campaign=webgui-kb" target="_blank">' + _Prtg.Lang.crumbler.strings.failovermaster2 + '</a>',
              time: _Prtg.Options.refreshInterval * 3
            });
          }
          if (s.ClusterType === 'failovernode') {
            _Prtg.Growls.add({
              id: 'clustergrowl',
              type: "info",
              title: _Prtg.Lang.crumbler.strings.failovernode1,
              message: '<a href="https://kb.paessler.com/en/topic/7663?utm_source=prtg&utm_medium=referral&utm_campaign=webgui-kb" target="_blank">' + _Prtg.Lang.crumbler.strings.failovernode2 + '</a>',
              time: _Prtg.Options.refreshInterval * 3
            });
          }
        }
        _Prtg.lastStats = null;
        _Prtg.lastStats = s;

        if(!me.growlIsConfirmed('growltrial')
        && s.TrialExpiryDays !== '-999999')
          me.checkExpiryDays(s.TrialExpiryDays,false)
            .off('click.confirm')
            .on('click.confirm','#closehelp',$.proxy(me.growlConfirm,me,'growltrial'));

        if(!me.growlIsConfirmed('growlcommercial')
        && s.CommercialExpiryDays !== '-999999')
          me.checkExpiryDays(s.CommercialExpiryDays,true)
            .off('click.confirm')
            .on('click.confirm','#closehelp',$.proxy(me.growlConfirm,me,'growlcommercial'));



        if(!me.growlIsConfirmed('growlmaint'))
          me.checkMaintExpiryDays(s.MaintExpiryDays)
            .off('click.confirm')
            .on('click.confirm','#closehelp',$.proxy(me.growlConfirm,me,'growlmaint'));

        _Prtg.Events.publish('newstats.prtg', _Prtg.lastStats);


        if(!!s.Warnings && !me.growlIsConfirmed('probewarnings')){
            s.Warnings.forEach(function(elm){
              _Prtg.Growls.add(elm)
                .off('click.confirm')
                .on('click.confirm','#closehelp',$.proxy(me.growlConfirm,me,'probewarnings'));
            });
          // }
        }
        checkAndPlayAudibleAlarm.call(_Prtg.lastStats);
      });
    }

    _Prtg.Events.subscribe('playalarm.events.prtg', $.proxy(checkAndPlayAudibleAlarm,_Prtg.lastStats));
    function checkAndPlayAudibleAlarm() {
      if ( this.NewAlarms > 0) _Prtg.AudibleAlarm.playAlarm();
    }

  };
  Plugin.prototype.growlIsConfirmed = function(id){
    if(!id) return;
    try{
      this.confirmedGrowls = JSON.parse(window.sessionStorage.getItem('Growls'))||{};
    }catch(e){this.confirmedGrowls ={};}
    return this.confirmedGrowls.hasOwnProperty(id) && this.confirmedGrowls[id].isconfirmed;
  }
  Plugin.prototype.growlConfirm = function(id){
    if(!id) return;
    this.confirmedGrowls[id] = {"isconfirmed":true};
    try{
      window.sessionStorage.setItem('Growls',JSON.stringify(this.confirmedGrowls));
    }catch(e){this.confirmedGrowls ={};}
  }
  Plugin.prototype.checkMaintExpiryDays= function (expirydays) {
      if (!!parseInt(expirydays,10)) {
        return $();
      }
      var getlic= _Prtg.Lang.crumbler.strings.prolong1a;
      var expireText = [
        _Prtg.Lang.crumbler.strings.prolong2b,
        _Prtg.Lang.crumbler.strings.prolong3b
      ];
      expireText[0] = expireText[0].replace("||days||", expirydays);
      expireText[1] = expireText[1].replace("||days||", -expirydays);

      if ((expirydays < 16) & (expirydays > 0)) {
        return _Prtg.Growls.add({
          id: 'growlmaint',
          type: "warning",
          title:' ',
          message: '<a target="_blank" href="https://shop.paessler.com/shop/prtg/maintenance/?license_hash=<#system type="licensehash">&utm_source=prtg&utm_medium=referral&utm_campaign=webgui-prolongmaintenance1&utm_content=maintenance">'+expireText[0]+getlic+'</a>',
          time: 99999
        });
      }
      if ((expirydays <= 0) & (expirydays > -10)) {
        return _Prtg.Growls.add({
          id: 'growlmaint',
          type: "warning",
          title:' ',
          message: '<a target="_blank" href="https://shop.paessler.com/shop/prtg/maintenance/?license_hash=<#system type="licensehash">&utm_source=prtg&utm_medium=referral&utm_campaign=webgui-prolongmaintenance2&utm_content=maintenance">'+expireText[1]+getlic+'</a>',
          time: 99999
        });
      }
      return $();
  };

  Plugin.prototype.checkExpiryDays = function (expirydays,iscommercial) {
      expirydays = parseInt(expirydays, 10)
      if (!expirydays || expirydays == -999999) {
          return $();
      } // freeware/commercial/POD/MSP/expired

      var getlic = !!_Prtg.lastStats && _Prtg.lastStats.EditionType!=="PT" ? _Prtg.Lang.crumbler.strings.POPLicense : _Prtg.Lang.crumbler.strings.PODLicense;
      var expireText = [
        _Prtg.Lang.crumbler.strings.trialwillexpire1a,
        _Prtg.Lang.crumbler.strings.trialwillexpire2a,
        _Prtg.Lang.crumbler.strings.trialwillexpire2ah,
        _Prtg.Lang.crumbler.strings.trialhasexpired,
        _Prtg.Lang.crumbler.strings.commercialwillexpire
      ];

      expireText[0] = expireText[0].replace("||days||", expirydays);
      expireText[1] = expireText[1].replace("||days||", '</b><h2>' + expirydays);
      expireText[2] = expireText[2].replace("||days||", expirydays);
      expireText[3] = expireText[3].replace("||days||", -expirydays);
      expireText[4] = expireText[4].replace("||days||", expirydays);

      if (iscommercial) {
          if ((expirydays < 32) & (expirydays > -1)) {
            return _Prtg.Growls.add({
              id: 'growlcommercial',
              type: "warning",
              title:_Prtg.Lang.crumbler.strings.Warning,
              message: '<a  href="/licensing.htm?tabid=1">'+expireText[4]+' '+_Prtg.Lang.crumbler.strings.clickformoreinfo+'</a>',
              time: 99999
            });
          }

      } else {
        if(_Prtg.lastStats.EditionType=="PT"){
          if(expirydays < 7){
            return _Prtg.Growls.add({
              id: 'growltrial',
              type: "warning",
              title:' ',
              message: '<a target="_blank" href="https://www.my-prtg.com/">'+expireText[1]+getlic+'</a>',
              time: 99999
            });
          }
        }else{
          if ((expirydays < 20) & (expirydays > 13)) {
            return _Prtg.Growls.add({
              id: 'growltrial',
              type: "info",
              title:' ',
              message: '<a target="_blank" href="https://www.paessler.com/order?utm_source=prtg&utm_medium=referral&utm_campaign=webgui-trialexpired1">'+expireText[0]+getlic+'</a>',
              time: 99999
            });
          }
          if ((expirydays < 14) & (expirydays > 7)) {
            return _Prtg.Growls.add({
              id: 'growltrial',
              type: "warning",
              title:' ',
              message: '<a target="_blank" href="https://www.paessler.com/order?utm_source=prtg&utm_medium=referral&utm_campaign=webgui-trialexpired2">'+expireText[1]+getlic+'</a>',
              time: 99999
            });
          }
          if ((expirydays < 8) & (expirydays > 0)) {
            return _Prtg.Growls.add({
              id: 'growltrial',
              type: "warning",
              title:' ',
              message: '<a target="_blank" href="https://www.paessler.com/order?utm_source=prtg&utm_medium=referral&utm_campaign=webgui-trialexpired3">'+expireText[2]+getlic+'</a>',
              time: 99999
            });
          }
          if ((expirydays <0) & (expirydays > -20)) {
            return _Prtg.Growls.add({
              id: 'growltrial',
              type: "warning",
              title:' ',
              message: '<a target="_blank" href="https://www.paessler.com/order?utm_source=prtg&utm_medium=referral&utm_campaign=webgui-trialexpired4">'+expireText[3]+getlic+'</a>',
              time: 99999
            });
          }
        }
      }
      return $();
  };



  Plugin.prototype.resetnewmessagestimestamp = function() {
    $.ajax({
      url: "/api/resetnewmessagestimestamp.htm",
      dataType: "text",
      type: "GET",
      beforeSend: function(jqXHR) {
         jqXHR.ignoreManager = true;
      },
      success: function() {
        try {
          window.localStorage.setItem("newalarmcount", 0);
        } catch(err) {}
      }
    });
  };
_Prtg.Plugins.registerPlugin(pluginName, Plugin);

})( jQuery, window, document );
