<script>
    // This is upgraded Zendesk Widget handler script. Ver: 1.3 Updated: 2020-04-24
    // It is intended to simplify the control of Widget behaviour through custom JavaScript configuration
    // Script is using Widget JS API https://developer.zendesk.com/embeddables/docs/widget/introduction
    // Script expects integrated Chat experience to be available
    // In this version the config is in a separate file, to be deployed at the same time (assumption: with a tag manager)

    (function() {
        function fireWidgetOnLoad() {
            var zendeskScript = document.createElement('script');
            zendeskScript.src = 'https://static.zdassets.com/ekr/snippet.js?key=' + WIDGET_KEY;
            zendeskScript.id = 'ze-snippet';
            zendeskScript.addEventListener('load', function() {
                runWidgetLogic().init( jumbo_config );
            });
            document.getElementsByTagName('body')[0].appendChild(zendeskScript);
        }
        var runWidgetLogic = function() {
            'use strict';
            var ze_module = {};
            ze_module.init = function(config) { // init Widget logic
                if (zE && config) {
                    window.onload = _applyWidgetConfig(config);
                } else {
                    console.warn('ERROR: Web Widget is missing or Web Widget configuration is missing, broken or missformatted. Widget settings will not be appllied.');
                    return;
                }
            };
            function _applyWidgetConfig(config) { // execute Widget logic
                _updateChatSettings(config);
                _setLocale(config.locale);
                _ww_visibility(config.widget_visibility);
                _setKBSuggestions(config.articleLabels);
                _updatePath(config.path);
                _setUserDetails(config.prefill_name, config.prefill_email);
                _IdentifyUsers(config.identify_name, config.identify_email);
                _updateGlobalSettings(config);
            }
            function _setLocale(locale) { // set the Widget language
                locale && zE('webWidget', 'setLocale', locale);
            }
          
            function _ww_visibility(widget_visibility) { // set the Widget visibility (hide/open/show)
                widget_visibility && zE('webWidget', widget_visibility);
            }
            function _setKBSuggestions(articleLabels) { // set the Widget suggested articles
                articleLabels && zE('webWidget', 'helpCenter:setSuggestions', {
                    labels: articleLabels
                });
            }
            function _setUserDetails(prefill_name, prefill_email) { // Prefills the user details
                prefill_email && zE('webWidget', 'prefill', {
                    name: {
                        value: prefill_name,
                        readOnly: true
                    },
                    email: {
                        value: prefill_email,
                        readOnly: true
                    }
                });
            }
            function _IdentifyUsers(identify_name, identify_email) { // Identifies an end user to Zendesk
                identify_email && zE('webWidget', 'identify', {
                    name: identify_name,
                    email: identify_email
                });
            }
            function _updatePath(pathObject) { // update the chat visitor’s webpath.
                pathObject && zE('webWidget', 'updatePath', pathObject);
            }
            function _setSurpressSettingProp(prop, val) { // extend config with suppress logic
                if (window.zESettings && window.zESettings.webWidget) {
                    var ww = window.zESettings.webWidget;
                    if (ww[prop]) ww[prop].suppress = val;
                    else ww[prop] = {
                        'suppress': val
                    }
                } else console.log('ERROR: Widget is missing window.zESettings object.')
            }
            function _updateGlobalSettings(config) { // update global Widget settings
                window.zESettings = config.webWidgetConfig ? {
                    webWidget: config.webWidgetConfig
                } : {
                    webWidget: {
                        chat: {
                            departments: {}
                        }
                    }
                };
                if (!window.zESettings.webWidget.chat) window.zESettings.webWidget.chat = {
                    departments: {}
                };
                _setSurpressSettingProp('helpCenter', !config.HCSearch);
                _setSurpressSettingProp('contactForm', !config.contactForm);
                _setSurpressSettingProp('talk', !config.talk);
                _setSurpressSettingProp('answerBot', !config.answerBot);
                // _setSurpressSettingProp('chat', !config.chat); // suppressing chat channel is handled after chat is connected
                _adjustChatLabel(config.HCSearch, config.chat, config.contactForm)
            }
            function _adjustChatLabel(HCSearch, chat, contactForm) { // change launcher label if contact options and chat are enabled
                // when contact options and chat are enabled Widget shows "Chat now" from webWidget.launcher.chatLabel,
                // however, it opens contact options instead of chat.
                // this function displays "Need Help?" from webWidget.launcher.label so label will make more sense
                var wwConf = window.zESettings.webWidget;
                if (wwConf.contactOptions && wwConf.contactOptions.enabled && wwConf.launcher) {
                    if (!(chat && !HCSearch && !contactForm)) wwConf.launcher.chatLabel = wwConf.launcher.label;
                }
            }
            function _updateChatSettings(config) { // update Chat settings when chat is connected
                zE('webWidget:on', 'chat:connected', function() {
                    _handleChatSettings(config);
                    // /show/hide the concierge options in the profile card area
                    zE('webWidget', 'updateSettings', {
                        webWidget: {
                            chat: {
                                profileCard: {
                                    avatar: true,
                                    rating: true,
                                    title: true
                                }
                            }
                        }
                    });
                    zE('webWidget:on', 'chat:status', function(status) {
                        _handleChatSettings(config);
                    });
                    zE('webWidget:on', 'chat:departmentStatus', function(status) {
                        _handleChatSettings(config);
                    });
                    // The below 2 functions can be used to identify particular events (chat started/ended), and as a result, perform actions like update 3rd parties (Google Analytics, etc)
                    // execute command on Chat Started
                    zE('webWidget:on', 'chat:start', function() {
                        // your code here
                    });
                    // execute command on Chat Ended
                    zE('webWidget:on', 'chat:end', function() {
                        // your code here
                    });

                    // When visitor is chating on one page and navigates to the page where chat is supressed
                    // it should re-open the Widget on the chat screen. Since there is no method to show chat screen
                    // this workaround will supress other channels > show Widget on the chat screen > re-enable
                    // other channels as per the config. Visitor may need to minimize and re-open the wiget to
                    // see the effect of re-enabling the other channels.
                    // Widget will not be auto-shown on mobile devices.
                    var isDesktop = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
                    if ((zE && zE('webWidget:get', 'chat:isChatting')) && (config.HCSearch || config.contactForm || config.answerBot) && isDesktop) {
                        if (zE('webWidget:get', 'display') !== 'chat') {
                            zE('webWidget', 'updateSettings', {
                                helpCenter: {
                                    'suppress': true
                                },
                                contactForm: {
                                    'suppress': true
                                },
                                talk: {
                                    'suppress': true
                                },
                                answerBot: {
                                    'suppress': true
                                }
                            });
                            zE('webWidget', 'show');
                            zE('webWidget', 'open');
                            zE('webWidget', 'updateSettings', {
                                helpCenter: {
                                    'suppress': !config.HCSearch
                                },
                                contactForm: {
                                    'suppress': !config.contactForm
                                },
                                talk: {
                                    'suppress': !config.talk
                                },
                                answerBot: {
                                    'suppress': !config.answerBot
                                }
                            });
                        }
                    }
                });
            }

            // Possible 'channel' values = helpCenter, contactForm, talk, answerBot
            // config = global variable for config
            // Suppress all Widget channels expect the given one and display the Widget
            // Intended to be used when Widget is controlled outside. For example,
            // Link on web site header to open contact form
            function _openChannel(channel, config) { 
            	var allowedChannels = ["contactForm","chat"]; // limiting channels to desired ones
            	if (channel && allowedChannels.indexOf(channel) > -1) {
            		zE('webWidget', 'updateSettings', _getSingleChanelSettings(channel));
            		zE('webWidget', 'show');
	               	zE('webWidget', 'open');
            	}
            	onCloseRevertBackWidgetConfig(config);
            }

            // Add event listener when Widget is minimised
            // Function will be executed only once
            var onCloseRevertBackWidgetConfig = (function(config) {
			    var executed = false;
			    return function(config) {
			        if (!executed) {
			            executed = true;
			            zE('webWidget:on', 'close', function() {
						    zE('webWidget', 'updateSettings', _getDefaultWidgetSettings(config));
						});
			        }
			    };
			})();

            // config = global variable for config
            // return the original state of widget channels
            function _getDefaultWidgetSettings(config) {
            	return {
	                    helpCenter: { 'suppress': !config.HCSearch },
	                    contactForm: { 'suppress': !config.contactForm },
	                    talk: { 'suppress': !config.talk },
	                    answerBot: { 'suppress': !config.answerBot },
	                    chat: { 'suppress': !config.chat }
	                };
            }

            // Possible 'channel' values = helpCenter, contactForm, talk, answerBot
            // Return all Widget channels suppressed except the desired one
            function _getSingleChanelSettings(channel) {
            	var defaultWidgetSettings = {
	                    helpCenter: { 'suppress': true },
	                    contactForm: { 'suppress': true },
	                    talk: { 'suppress': true },
	                    answerBot: { 'suppress': true },
	                    chat: { 'suppress': true }
	                };
	            defaultWidgetSettings[channel].suppress = false;
	            
	            return defaultWidgetSettings;
            }

            // check whether chat departments were defined
            function _isChatDepartamentDefined(departments) {
            	return !departments || ((departments.enabled !== undefined) || (departments.select !== undefined));
            }

            function _handleChatSettings(config) {
                setTimeout(function() { // Delay is needed to allow chat server to update. Otherwise isChatting is always true
                    if (_isChatDepartamentDefined(config.departments)) {
                        var department_status,
                            isDepartmentOnline,
                            isChatting = zE && zE('webWidget:get', 'chat:isChatting');
                        
                        // Handles different combinations od Chat departments config
                        // 1 - when department is selected it will suppress chat based on that department online status
                        // 2 - when department is NOT selected it will suppress chat if none of listed departments is online
                        // 3 - (handled outside of this block) if departments is empty or undefined no department online status check will be applied
                        if (config.departments && config.departments.select) {
                            department_status = zE('webWidget:get', 'chat:department', config.departments.select);
                            isDepartmentOnline = department_status && department_status.status === 'online';
                        } else if (config.departments && config.departments.enabled && config.departments.enabled.length) {
                        	for (var i = 0; i < config.departments.enabled.length; i++) {
                                var chatDep = zE('webWidget:get', 'chat:department', config.departments.enabled[i]);
                                if (chatDep === undefined) {
                                    console.warn('ERROR: The following department does not exist or may have incorrect name: ' + config.departments.enabled[i]);
                                }
                        		if (chatDep && (chatDep.status === 'online')) {
                        			isDepartmentOnline = true;
                        			break;
                        		}
                        	}
                        }
                        if (isChatting || isDepartmentOnline) {
                            // ONLINE LOGIC
                            // Chat will be suppressed when noone is chatting or when department is offline
                            zE('webWidget', 'updateSettings', {
                                webWidget: {
                                    chat: {
                                        departments: config.departments,
                                        suppress: false
                                    }
                                }
                            });
                        } else {
                            // OFFLINE & UNDEFINED LOGIC (undefined = a department with this name doesn't exist OR the department has been disabled)
                            // suppress the Chat channel as the targeted department is offline
                            zE('webWidget', 'updateSettings', {
                                webWidget: {
                                    chat: {
                                        suppress: true
                                    }
                                }
                            });
                        }
                    } else {
                        zE('webWidget', 'updateSettings', window.zESettings.webWidget);
                    }
                }, 250);
            }
            return ze_module;
        };
        window.addEventListener ? window.addEventListener('load', fireWidgetOnLoad, !1) : window.attachEvent ? window.attachEvent('onload', fireWidgetOnLoad) : window.onload = fireWidgetOnLoad
    })(); 
</script>