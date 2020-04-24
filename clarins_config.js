<script>
    // Clarins config, April 2020

    var WIDGET_KEY = '7d9ce1ae-54eb-4ea6-9a21-154bbda1aeba';
    var jumbo_config = {
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
        // select: 'Other HR questions (Latvia)' will preset Chat department, 
        departments: {
            //enabled: ['Online Orders','SkinSpa & BeautyBAR','Online Promotions & Loyalty','Products','Store Experience']
            //select: ''
        }, 					
        // OPTIONAL: Set widget language https://developer.zendesk.com/embeddables/docs/widget/core#setlocale
        locale: 'en-gb',
        // load the Web Widget in the "show" or "hide" state: https://developer.zendesk.com/embeddables/docs/widget/core#show
        widget_visibility: 'hide',
        articleLabels: ['topSuggestions'],
        // OPTIONAL: config for window.zESettings.webWidget
        webWidgetConfig: {
            // Specifies whether to enable or disable Google Analytics tracking. https://support.zendesk.com/hc/en-us/community/posts/360003215947
            analytics: true,
            zIndex: 9999999998,
            contactOptions: {
                enabled: true,
                contactButton: {
                    '*': 'Get in Touch'
                },
                // The Chat Label on the Contact Options window
                chatLabelOnline: {
                    '*': 'Live Chat'
                },
                chatLabelOffline: {
                    '*': 'Chat is Offline'
                },
                // The Contact Form Label
                contactFormLabel: {
                    '*': 'Send us a message'
                }
            },
            // The Widget Color
            color: {
                theme: '#000000'
            },
            launcher: {
                // The Web Widget button title (HC/Contact Form are On)
                label: {
                    '*': 'Have a Question?'
                },
                // The Web Widget button title (HC is Off)
                chatLabel: {
                    '*': 'Chat now'
                },
                // Set to true if you want to display the label in mobile browsers
                mobile: {
                    labelVisible: false
                }
            },
            helpCenter: {
                // Sets the title of the Help Center Window
                title: {
                    '*': 'Clarins Support'
                },
                // Sets the visibility of the button that would redirect the user to the full HC portal    
                originalArticleButton: false
            },
            contactForm: {
                title: {
                    '*': 'Clarins Support'
                },
                // Set a specific ticket form. The form ID can be found in the URL while on the form page. Uncomment the following line to enable this.
                ticketForms: [{ id: 360000120758 }],
                // Enable to disable the attachments option in the Contact Forms
                attachments: true
            },
            // Sets the visibility of the popout button 
            navigation: {
                popoutButton: {
                    enabled: false
                }
            },
            talk: {
                nickname: 'callback_clarins'
            },
            chat: {
                prechatForm: {
                    // The Prechat greeting text
                    greeting: {
                        '*': 'Please fill out the form below to start the chat with us.'
                    },
                    departmentLabel: {
                        '*': 'What is your issue about?'
                    }
                },
                title: {
                    '*': 'Chat with us'
                },
                concierge: {
                    // the Concierge parameters
                    avatarPath: 'https://theme.zdassets.com/theme_assets/9399077/b73d04d5028bb5eca32f296dfe0ba01784bfcb4c.jpg',
                    name: 'Welcome to Live Chat',
                    title: {
                        '*': 'How can we help you today ?'
                    }
                },
                // Sets the visibility of the "Email Transcript" option on the chat window:https://dl.dropbox.com/s/e822el7vir7ur8p/Web_Widget_chat_Window_menu_options_email_transcript.png?dl=0
                menuOptions: {
                    emailTranscript: true
                },
                // Add the relevant tags to the Chat session
                tags: ['brand_clarins']
            },
            answerBot: {
                title: {
                    '*': 'Clarins Support'
                },
                avatar: {
                    //url: '',
                    name: {
                        '*': 'Olivia'
                    }
                },
                // Set to TRUE if you want the question to be asked before other contact options are displayed
                contactOnlyAfterQuery: false
            }
        }
    }; 
</script>