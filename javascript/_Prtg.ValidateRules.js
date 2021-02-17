$.validator.addMethod("dateDE",function(value,element){return this.optional(element)||/^\d\d?\.\d\d?\.\d\d\d?\d?$/.test(value)},'<#langjs key="js.validate.date" default="Please enter a valid date.">');$.validator.addMethod("numberDE",function(value,element){return this.optional(element)||/^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(value)},'<#langjs key="js.validate.number" default="Please enter a valid number.">');
$.validator.addMethod("ipcbase",function(value,element){return this.optional(element)||/^\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b$/.test(value)},'<#langjs key="js.validate.ipcbase" default="Please enter a valid class C network IP base (e.g. 192.168.0 ).">');$.validator.addMethod("iplist",function(value,element){return this.optional(element)||true},'<#langjs key="js.validate.iplist" default="Please enter a list of valid IP addresses.">');
$.validator.addMethod("ipsubnet",function(value,element){return this.optional(element)||/^\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b\/\b((3[0-1]|[12][0-9]|[1-9])|(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))\b$/.test(value)},'<#langjs key="js.validate.ipsubnet" default="Please enter a valid IP subnet (e.g. 192.168.0.0/255.255.255.0 or 192.168.0.0/24).">');
$.validator.addMethod("ipoctetrange",function(value,element){return this.optional(element)||/^(\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b|(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)-(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))\.(\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b|(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)-(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))\.(\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b|(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)-(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)-(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b))$/.test(value)},
'<#langjs key="js.validate.ipoctetrange" default="Please enter a valid network IP octet range (e.g. 192.168.0-10.1-255 ).">');$.validator.addMethod("ipsingle",function(value,element){return this.optional(element)||true},'<#langjs key="js.validate.ipsingle" default="Please enter a single valid IP address (e.g. 192.168.0.1 ).">');$.validator.addMethod("hexcolor",function(value,element){return this.optional(element)||/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)},'<#langjs key="js.validate.hexcolor" default="Please enter a valid hex color with prefixed #">');
$.validator.addMethod("oid",function(value,element){return this.optional(element)||/^[.]?1\.[0-3](\.(([0-9]+)|("[A-Za-z0-9]+")|('[A-Za-z0-9]+')))+$/.test(value)||/^norfccheck:.*/i.test(value)},'<#langjs key="js.validate.oid" default="Please enter a valid OID value (e.g. 1.3.6.1.2.1.1.3.0 or 1.3.6.1.4.&quot;apcupsd&quot;.2)">');
$.validator.addMethod("mapsecretkey",function(value,element){var check=true;if(value.indexOf(",")!==-1)check=false;if(value.indexOf(":")!==-1)check=false;return this.optional(element)||check},'<#langjs key="js.validate.mapsecretkey" default="The characters , and : are not allowed">');
$.validator.addMethod("passwordcapital",function(value,element){var check=false;if($("#login_").length>0&&$("#login_").val()==="prtgadmin"&&value==="prtgadmin")check=true;else check=/[A-Z]/.test(value);return this.optional(element)||check},'<#langjs key="js.validate.passwordcapital" default="Minimum 1 capital letter (A-Z)!">');
$.validator.addMethod("passwordnumber",function(value,element){var check=false;if($("#login_").length>0&&$("#login_").val()==="prtgadmin"&&value==="prtgadmin")check=true;else check=/[0-9]/.test(value);return this.optional(element)||check},'<#langjs key="js.validate.passwordnumber" default="Minimum 1 number!">');
$.validator.addMethod("passwordchartimes",function(value,element){return true;var passwordchartimescheck=false;if($("#login_").length>0&&$("#login_").val()==="prtgadmin"&&value==="prtgadmin")passwordchartimescheck=true;else passwordchartimescheck=!/(.)(.*\1){3,}/.test(value);return this.optional(element)||passwordchartimescheck},'<#langjs key="js.validate.passwordchartimes" default="Not more than 3 identical characters!">');
$.validator.addMethod("pwminlength",function(value,element,param){var length=$.isArray(value)?value.length:this.getLength($.trim(value),element);return this.optional(element)||length>=param},$.validator.format('<#langjs key="js.validate.minlength" default="Please enter at least {0} characters.">'));$.validator.addMethod("asciionly",function(value,element){return this.optional(element)||/^[\x00-\x7F]*$/.test(value)},'<#langjs key="js.validate.asciionly" default="Please enter ASCII characters only!">');
$.validator.addMethod("purgedate",function(value,element){var selected=$(element).data("plugin_prtgDatetimepicker").getCurrentSelectedDate();var arr=_Prtg.Options.lastpurgedate.split("-");var lastpurge=new Date(arr[0],arr[1]-1,arr[2],arr[3],arr[4],arr[5]);var result=false;if(selected.getTime()>lastpurge.getTime())result=true;if($(element).hasClass("orginal_input"))result=true;return this.optional(element)||result},function(){var helpText='<#langjs key="js.validate.purgedate" default="Warning: You cannot generate the historic data report because data is only available as of the last data purge on PURGEDATE. Please adjust the start date accordingly.">';
helpText=helpText.replace("PURGEDATE",_Prtg.Options.lastpurgedate);return helpText});$.validator.addMethod("ticketnumber",function(value,element){var number=value.substr(3);return this.optional(element)||number>1E5&&/^(pae|PAE)[0-9]{6}[0-9]?$/.test(value)},'<#langjs key="js.validate.ticketnumber" default="Please enter your ticket number in the form PAE plus six or seven digits, e.g. PAE123456 or PAE1234567">');
jQuery.extend(jQuery.validator.messages,{required:'<#langjs key="js.validate.required" default="This field is required.">',remote:'<#langjs key="js.validate.remote" default="Please fix this field.">',email:'<#langjs key="js.validate.email" default="Please enter a valid email address.">',url:'<#langjs key="js.validate.url" default="Please enter a valid URL.">',date:'<#langjs key="js.validate.date" default="Please enter a valid date.">',dateISO:'<#langjs key="js.validate.dateISO" default="Please enter a valid date (ISO).">',
number:'<#langjs key="js.validate.number" default="Please enter a valid number.">',digits:'<#langjs key="js.validate.digits" default="Please enter only digits.">',creditcard:'<#langjs key="js.validate.creditcard" default="Please enter a valid credit card number.">',equalTo:'<#langjs key="js.validate.equalTo" default="Please enter the same value again.">',accept:'<#langjs key="js.validate.accept" default="Please enter a value with a valid extension.">',maxlength:$.validator.format('<#langjs key="js.validate.maxlength" default="Please enter no more than {0} characters.">'),
minlength:$.validator.format('<#langjs key="js.validate.minlength" default="Please enter at least {0} characters.">'),rangelength:$.validator.format('<#langjs key="js.validate.rangelength" default="Please enter a value between {0} and {1} characters long.">'),range:$.validator.format('<#langjs key="js.validate.range" default="Please enter a value between {0} and {1}.">'),max:$.validator.format('<#langjs key="js.validate.max" default="Please enter a value less than or equal to {0}.">'),min:$.validator.format('<#langjs key="js.validate.min" default="Please enter a value greater than or equal to {0}.">')});
