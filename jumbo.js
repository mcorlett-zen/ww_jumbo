
    // This is upgraded Zendesk Widget handler script. Ver: 1.20 Updated: 2020-03-30
    // MAC: Expose status of chat channel
    // It is intended to simplify the control of Widget behaviour through custom JavaScript configuration
    // Script is using Widget JS API https://developer.zendesk.com/embeddables/docs/widget/introduction
    // Script expects integrated Chat experience to be available
    // To run the script follow the steps below:
    // 1. update WIDGET_KEY
    // 2. Decide which part of the Widget you want to run using runWidgetLogic().init({settings object});
    // 3. Configure {settings object}
    // 4. Copy final code to desired pages and run.

    // Expose our detected chat status
    // States are: 
    // "loading" - page is loading, status is unknown
    // "avaliable" - chat is available
    // "unavailable" - chat is not available, agent or dept offline
    // "chatting" - chat in progress
    var zeChatStatusEx = "loading";

    (function() {
        var WIDGET_KEY = 'de54a179-0dc2-4a94-b9fa-8715746c09f0';
        function fireWidgetOnLoad() {
            var zendeskScript = document.createElement('script');
            zendeskScript.src = 'https://static.zdassets.com/ekr/snippet.js?key=' + WIDGET_KEY;
            zendeskScript.id = 'ze-snippet';
            zendeskScript.addEventListener('load', function() {

                /**
                 * Change the Widget settings.
                 * @params {object} Config - required object defining Widget channels and settings
                 */
                runWidgetLogic().init({
                    // REQUIRED: enable HC Search?
                    HCSearch: true,
                    // REQUIRED: enable chat?
                    chat: true,
                    // REQUIRED: enable contact form?
                    contactForm: true,
                    // REQUIRED: enable Talk (call back)?
                    talk: false,
                    // REQUIRED: enable answerBot?
                    answerBot: false,
                    // OPTIONAL: Chat department configuration
                    // enabled: [''] will hide Department selector
                    // select: 'DEPARTMENT NAME' will preset Chat department
                    departments: {
                        enabled: ['Support UK'],
                        select: 'Support UK'
                    },
                    // OPTIONAL: Set widget language https://developer.zendesk.com/embeddables/docs/widget/core#setlocale
                    // locale: 'en-us',
                    // load the Web Widget in the "show" or "hide" state: https://developer.zendesk.com/embeddables/docs/widget/core#show
                    widget_visibility: 'hide',
                    //articleLabels: ['topSuggestions'],
                    //prefill_name: name,
                    //prefill_email: email,
                    //identify_name: name,
                    //identify_email: email,
                    
                    // OPTIONAL: config for window.zESettings.webWidget
                    webWidgetConfig: {
                        // // Specifies whether to enable or disable Google Analytics tracking. https://support.zendesk.com/hc/en-us/community/posts/360003215947
                        // analytics: true,
                        // zIndex: 9999999998,
                        // contactOptions: {
                        //     enabled: true,
                        //     contactButton: {
                        //         '*': 'Get in Touch'
                        //     },
                        //     // The Chat Label on the Contact Options window
                        //     chatLabelOnline: {
                        //         '*': 'Live Chat'
                        //     },
                        //     chatLabelOffline: {
                        //         '*': 'Chat is Offline'
                        //     },
                        //     // The Contact Form Label
                        //     contactFormLabel: {
                        //         '*': 'Send us a message'
                        //     }
                        // },
                        // // The Widget Color
                        // color: {
                        //     theme: '#9C8EB5'
                        // },
                        // launcher: {
                        //     // The Web Widget button title (HC/Contact Form are On)
                        //     label: {
                        //         '*': 'Need Help?'
                        //     },
                        //     // The Web Widget button title (HC is Off)
                        //     chatLabel: {
                        //         '*': 'Chat now'
                        //     },
                        //     // Set to true if you want to display the label in mobile browsers
                        //     mobile: {
                        //         labelVisible: false
                        //     }
                        // },
                        // helpCenter: {
                        //     // Sets the title of the Help Center Window
                        //     title: {
                        //         '*': 'BAT Support'
                        //     },
                        //     // Sets the visibility of the button that would redirect the user to the full HC portal    
                        //     originalArticleButton: true
                        // },
                        // contactForm: {
                        //     title: {
                        //         '*': 'BAT Support'
                        //     },
                        //     // Set a specific ticket form. The form ID can be found in the URL while on the form page. Uncomment the following line to enable this.
                        //     //ticketForms: [{ id: 360000102598 }, { id: 360000102718 }],
                        //     // Enable to disable the attachments option in the Contact Forms
                        //     attachments: true
                        // },
                        // // Sets the visibility of the popout button 
                        // navigation: {
                        //     popoutButton: {
                        //         enabled: false
                        //     }
                        // },
                        // talk: {
                        //     nickname: 'CallBack_bv'
                        // },
                        // chat: {
                        //     prechatForm: {
                        //         // The Prechat greeting text
                        //         greeting: {
                        //             '*': 'Please fill out the form below to start the chat with us.'
                        //         }
                        //     },
                        //     title: {
                        //         '*': 'Chat with us'
                        //     },
                        //     concierge: {
                        //         // the Concierge parameters
                        //         avatarPath: 'https://theme.zdassets.com/theme_assets/1023626/8c5e1ce2dd7d5a649a8f297295e52666fa125d81.png',
                        //         name: 'Welcome to Live Chat',
                        //         title: {
                        //             '*': 'How can we help you today ?'
                        //         }
                        //     },
                        //     // Sets the visibility of the "Email Transcript" option on the chat window:https://dl.dropbox.com/s/e822el7vir7ur8p/Web_Widget_chat_Window_menu_options_email_transcript.png?dl=0
                        //     menuOptions: {
                        //         emailTranscript: true
                        //     },
                        //     // Add the relevant tags to the Chat session
                        //     tags: ['brand_bv']
                        // },
                        // answerBot: {
                        //     title: {
                        //         '*': 'BAT Support'
                        //     },
                        //     avatar: {
                        //         //url: '',
                        //         name: {
                        //             '*': 'Olivia'
                        //         }
                        //     },
                        //     // Set to TRUE if you want the question to be asked before other contact options are displayed
                        //     contactOnlyAfterQuery: false
                        // }
                    }
                });
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
                    console.log('ERROR: Widget or Widget configuration is missing. Widget settings will not be appllied.');
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
            function _setKBSuggestions(articleLabels) { // set the Widget language
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
                // _setSurpressSettingProp('chat', !config.chat); // NB suppressing chat channel is handled after chat is connected
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
                        _handleChatSettings(config);
                        // your code here
                    });
                    // execute command on Chat Ended
                    zE('webWidget:on', 'chat:end', function() {
                        _handleChatSettings(config);
                        // your code here
                    });
                    // When visitor is chatting on one page and navigates to the page where chat is supressed
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
            function _handleChatSettings(config) {
                setTimeout(function() { // Delay is needed to allow chat server to update. Otherwise isChatting is always true
                    if (config.departments) {
                        var department_status,
                            isDepartmentOnline,
                            isChatting = zE && zE('webWidget:get', 'chat:isChatting');
                        if (config.departments.select) {
                            department_status = zE('webWidget:get', 'chat:department', config.departments.select);
                            isDepartmentOnline = department_status && department_status.status === 'online';
                        }
                        if (isChatting || isDepartmentOnline) {
                            // ONLINE LOGIC
                            // Chat will be suppressed when noone is chatting or when department is offline
                            zeChatStatusEx = isChatting ? "chatting" : "available";
                            zE('webWidget', 'updateSettings', {
                                webWidget: {
                                    chat: {
                                        departments: config.departments,
                                        suppress: false
                                    }
                                }
                            });
                        } else {
                            zeChatStatusEx = "unavailable";
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

