/*

 ######  ####### ######   #####  ####### ######  ####### ######
 #     # #       #     # #     # #     # #     # #       #     #
 #     # #       #     # #       #     # #     # #       #     #
 ######  #####   #     # #       #     # #     # #####   ######
 #   #   #       #     # #       #     # #     # #       #   #
 #    #  #       #     # #     # #     # #     # #       #    #
 #     # ####### ######   #####  ####### ######  ####### #     #

 RedJS
 Version 1.01
 License : MIT
 Coded By RedCoder
 http://redframework.ir

 */

"use strict";

var Red = {

        app: {

            modules: {}
            ,
            storage: {}
            ,

            module: function (module, controllers) {

                this.modules[module] = {controllers: {}, models: {}, routes: {}};


                if (controllers != null) {

                    Object.keys(controllers).forEach(function (key) {

                        var controller = key;
                        var constructor = controllers[key];

                        Red.app.modules[module]['controllers'][controller] = {
                            factory: constructor,
                            variables: [],
                            instances: [],
                        };

                        Red.app.addModel(module, controller);

                        var instance = new Red.app.modules[module]['controllers'][controller]['factory'];


                        Red.app.modules[module]['controllers'][controller]['instances'] = instance;
                        var app_element = document.querySelector('[red-app=' + module + ']');

                        if (app_element.getAttribute('red-controller') == null) {
                            Array.prototype.slice.call(app_element.querySelectorAll('[red-controller=' + controller + ']'))
                                .map(function (controller_element) {


                                    if (controller_element === null) {
                                        return false;
                                    }

                                    if (controller_element.getAttribute('red-controller') === controller) {
                                        if (controller_element.getAttribute('red-init') != null) {
                                            Red.app.modules[module]['controllers'][controller]['variables'] = controller_element.getAttribute('red-init');
                                        }

                                        Red.app.store(module, controller, controller_element);

                                        Red.app.controllerBinder(module, controller, instance);

                                    }
                                });
                        } else {

                            if (app_element.getAttribute('red-controller') === controller) {

                                if (app_element.getAttribute('red-init') != null) {
                                    Red.app.modules[module]['controllers'][controller]['variables'] = app_element.getAttribute('red-init');
                                }

                                this.store(module, controller, app_element);

                                this.controllerBinder(module, controller, instance);


                            }


                        }
                    });

                }


            },

            addController: function (module, controller, constructor) {

                this.modules[module]['controllers'][controller] = {
                    factory: constructor,
                    variables: [],
                    instances: [],
                };

                this.addModel(module, controller);


                var app_element = document.querySelector('[red-app=' + module + ']');

                var instance = new this.modules[module]['controllers'][controller]['factory'];

                if (app_element.getAttribute('red-controller') == null) {
                    Array.prototype.slice.call(app_element.querySelectorAll('[red-controller=' + controller + ']'))
                        .map(function (controller_element) {

                            if (controller_element === null) {
                                return false;
                            }

                            if (controller_element.getAttribute('red-init') != null) {
                                Red.app.modules[module]['controllers'][controller]['variables'] = controller_element.getAttribute('red-init');
                            }

                            Red.app.store(module, controller, controller_element);

                            Red.app.controllerBinder(module, controller, instance);

                        });
                } else {

                    if (app_element.getAttribute('red-controller') === controller) {

                        if (app_element.getAttribute('red-init') != null) {
                            this.modules[module]['controllers'][controller]['variables'] = app_element.getAttribute('red-init');
                        }

                        this.store(module, controller, app_element);

                        this.controllerBinder(module, controller, instance);

                    }

                }


            }
            ,
            addModel: function (module, model) {


                this.modules[module]['models'][model] = {
                    data: [],
                    feeder_elements: [],
                };

                var app_element = document.querySelector('[red-app=' + module + ']');

                if (app_element.getAttribute('red-controller') == null) {
                    Array.prototype.slice.call(app_element.querySelectorAll('[red-controller=' + model + ']'))
                        .map(function (controller_element) {

                            if (controller_element === null) {
                                return false;
                            }

                            Array.prototype.slice.call(controller_element.querySelectorAll('[red-model]'))
                                .map(function (model_element) {

                                    Red.app.modelBinder(module, model, model_element);


                                    var model_data = model_element.getAttribute('red-model');

                                    if (model_element.value === 'undefined') {
                                        Red.app.modules[module]['models'][model]['data']['model_' + model_data] = model_element.innerHTML;


                                        Array.prototype.slice.call(controller_element.querySelectorAll('[red-bind="model_' + model_data + '"]'))
                                            .map(function (feeder_element) {
                                                Red.app.modules[module]['models'][model]['feeder_elements'].push(feeder_element);
                                            });

                                    } else {
                                        Red.app.modules[module]['models'][model]['data']['model_' + model_data] = model_element.value;

                                        Array.prototype.slice.call(controller_element.querySelectorAll('[red-bind="model_' + model_data + '"]'))
                                            .map(function (feeder_element) {
                                                Red.app.modules[module]['models'][model]['feeder_elements'].push(feeder_element);
                                            });
                                    }

                                });


                        });
                } else {

                    if (app_element.getAttribute('red-controller') === model) {
                        Array.prototype.slice.call(app_element.querySelectorAll('[red-model]'))
                            .map(function (model_element) {


                                var model_data = model_element.getAttribute('red-model');


                                Red.app.modelBinder(module, model, model_element);

                                if (model_element.value === 'undefined') {

                                    Red.app.modules[module]['models'][model]['data']['model_' + model_data] = model_element.innerHTML;

                                    Array.prototype.slice.call(app_element.querySelectorAll('[red-bind="model_' + model_data + '"]'))
                                        .map(function (feeder_element) {
                                            Red.app.modules[module]['models'][model]['feeder_elements'].push(feeder_element);
                                        });

                                } else {
                                    Red.app.modules[module]['models'][model]['data']['model_' + model_data] = model_element.value;

                                    Array.prototype.slice.call(app_element.querySelectorAll('[red-bind="model_' + model_data + '"]'))
                                        .map(function (feeder_element) {
                                            Red.app.modules[module]['models'][model]['feeder_elements'].push(feeder_element);
                                        });
                                }
                            });
                    }

                }



            },

            registerRoute: function (module, routes) {


                Object.keys((routes)).forEach(function (route_name) {

                    Red.app.modules[module]['routes'][route_name] = routes[route_name];

                    var app_element = document.querySelector('[red-app=' + module + ']');


                    if (app_element == null) {
                        return false;
                    }

                    Array.prototype.slice.call(app_element.querySelectorAll('[href="#!' + route_name + '"]'))
                        .map(function (route_element) {

                            route_element.setAttribute("href", routes[route_name]);

                        });
                })

            },

            store: function (module, controller, controller_element) {

                if (this.storage[module] == null) {
                    this.storage[module] = {};
                }

                this.storage[module][controller] = {};


                Array.prototype.slice.call(controller_element.querySelectorAll('[red-bind]'))
                    .map(function (bind_element) {

                        var bind_flag = bind_element.getAttribute('red-bind');


                        if (bind_flag == null) {
                            return false;
                        }


                        if (Red.app.storage[module][controller][bind_flag] == null) {

                            Red.app.storage[module][controller][bind_flag] = {
                                bind_value: bind_flag,
                                elements: [],
                            };
                        }

                        Red.app.storage[module][controller][bind_flag].elements.push(bind_element);
                    });


            }
            ,

            controllerBinder: function (module, controller, instance) {


                Object.keys(this.storage[module][controller]).forEach(function (bind_flag) {

                    Red.app.storage[module][controller][bind_flag].elements.forEach(function (bind_element) {


                        var controller_variables;

                        controller_variables = Red.app.modules[module]['controllers'][controller]['variables'];


                        var object_variables = '';

                        Object.keys(instance).forEach(function (key) {
                            object_variables += "var " + key + " = '" + instance[key] + "';";
                        });

                        var bind_flag = bind_element.getAttribute('red-bind');


                        var model = controller;


                        Object.keys(Red.app.modules[module]['models'][model]['data']).forEach(function (key) {
                            object_variables += "var " + key + " = '" + Red.app.modules[module]['models'][model]['data'][key] + "';";
                        });


                        var result = eval(controller_variables + object_variables + bind_flag);

                        if (bind_element.value == null) {

                            bind_element.innerHTML = result;

                        } else {

                            bind_element.value = result;

                        }


                    });

                });

            }
            ,

            modelBinder: function (module, model, model_element) {

                model_element.addEventListener('input', function () {

                    var model_data = model_element.getAttribute('red-model');

                    Red.app.modules[module]['models'][model]['data']['model_' + model_data] = model_element.value;

                    Red.app.modules[module]['models'][model]['feeder_elements'].forEach(function (feeder_element) {

                        if (feeder_element.getAttribute('red-bind') === 'model_' + model_data) {

                            if (feeder_element.value == null) {
                                feeder_element.innerHTML = model_element.value;
                            } else {
                                feeder_element.value = model_element.value;
                            }

                        }
                    });

                }, false);
            },
        }
        ,
        validateServiceRules: [],
        filterServiceRules: [],
        sanitizeServiceRules: [],

        ready: function (callback) {

            if (document.readyState !== 'loading') {
                callback();
            } else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
            else {
                document.attachEvent('onreadystatechange', function () {
                    if (document.readyState === 'complete') {
                        callback();
                    }
                });
            }
        },

        get: function (selector) {
            var elements = document.querySelectorAll(selector);
            if (elements.length > 1) {
                return elements;
            } else {
                return elements[0];
            }
        },

        select: function (selector) {

            var elements = [];

            if (typeof selector == 'string') {

                elements = document.querySelectorAll(selector);


                var elements_as_array = [];
                var elements_length = elements.length;

                for (var counter = 0; counter <= elements_length + 1; counter++) {
                    if (elements[counter]) {
                        elements_as_array.push(elements[counter]);
                    }
                }

                elements = elements_as_array;

            } else {
                var is_element = typeof HTMLElement === "object" ? selector instanceof HTMLElement :
                    selector && typeof selector === "object" && selector !== null && selector.nodeType === 1 && typeof selector.nodeName === "string";
                if (is_element !== true) {

                    elements = new Array(selector);

                    elements = elements[0];

                } else {

                    elements = new Array(selector);

                    elements[0] = selector;
                }
            }


            return {

                elements: function () {
                    return elements;
                },

                innerHTML: function (value) {

                    if (value == null) {
                        if (elements.length > 1) {
                            var content = [];
                            elements.forEach(function (element) {
                                content.push(element.innerHTML);
                            });
                            return content;
                        } else {
                            return elements[0].innerHTML;
                        }
                    } else {
                        elements.forEach(function (element) {
                            element.innerHTML = value;
                        });
                    }

                },
                outerHTML: function (value) {
                    if (value == null) {
                        if (elements.length > 1) {
                            var content = [];
                            elements.forEach(function (element) {
                                content.push(element.outerHTML);
                            });
                            return content;
                        } else {
                            return elements[0].outerHTML;
                        }
                    } else {
                        elements.forEach(function (element) {
                            element.outerHTML = value;
                        });
                    }
                },

                value: function (value) {
                    if (elements.length > 1) {
                        if (value != null){
                            elements.forEach(function (element) {
                                element.value = value;
                            });
                        } else {
                            var values = [];
                            elements.forEach(function (element) {
                                values.push(element.value);
                            });
                            return values;
                        }
                    } else {
                        if (value != null){
                            elements[0].value = value;
                        } else {
                            return elements[0].value;
                        }
                    }
                },

                after: function (value) {
                    elements.forEach(function (element) {
                        element.insertAdjacentHTML('afterend', value);
                    });
                },

                before: function (value) {
                    elements.forEach(function (element) {
                        element.insertAdjacentHTML('beforeend', value);
                    });
                },


                CSS: function (property, value) {
                    var properties = [];
                    if (value != null) {
                        elements.forEach(function (element) {
                            element.style[property] = value;
                        });
                    } else {
                        if (typeof property != 'string') {
                            elements.forEach(function (element) {
                                properties = Object.keys(property);
                                properties.forEach(function (prop) {
                                    element.style[prop] = property[prop];
                                });
                            });
                        } else {
                            elements.forEach(function (element) {
                                properties.push(getComputedStyle(element)[property]);
                            });
                            if (elements.length > 1) {
                                return properties;
                            } else {
                                return properties[0];
                            }
                        }
                    }

                },

                append: function (child) {
                    elements.forEach(function (element) {
                        element.appendChild(child);

                    });
                },

                clone: function () {
                    if (elements.length > 1) {
                        var nodes = [];
                        elements.forEach(function (element) {
                            nodes.push(element.cloneNode(true));
                        });
                        return nodes;
                    } else {
                        return elements[0].cloneNode(true);
                    }
                },

                parent: function () {
                    if (elements.length > 1) {
                        var parents;
                        elements.forEach(function (element) {

                            parents.push(element.parentNode);
                        });
                        return parents;
                    } else {
                        return elements[0].parentNode;
                    }
                },

                prev: function () {
                    if (elements.length > 1) {
                        var previous_sibling;
                        elements.forEach(function (element) {
                            previous_sibling.push(element.previousElementSibling);
                        });
                        return previous_sibling;
                    } else {
                        return elements[0].previousElementSibling;
                    }

                },

                next: function () {
                    if (elements.length > 1) {
                        var next_sibling;
                        elements.forEach(function (element) {
                            next_sibling.push(element.nextElementSibling);
                        });
                        return next_sibling;
                    } else {
                        return elements[0].nextElementSibling;
                    }
                },

                children: function () {
                    if (elements.length > 1) {
                        var children = [];
                        elements.forEach(function (element) {
                            children.push(element.outerHTML);
                        });
                        return children;
                    } else {
                        return elements[0].children;
                    }
                },

                contains: function (child) {
                    if (elements.length > 1) {
                        var result;
                        elements.forEach(function (element) {
                            result.push(element.contains(child));
                        });
                        return result;
                    } else {
                        return elements[0].contains(child)
                    }

                },


                on: function (event, event_handler) {
                    elements.forEach(function (element) {
                        element.addEventListener(event, event_handler);
                    });
                },
                off: function (event, event_handler) {
                    elements.forEach(function (element) {
                        element.removeEventListener(event, event_handler);
                    });
                },

                load: function (event_handler) {
                    elements.forEach(function (element) {
                        element.addEventListener('load', event_handler);
                    });
                },

                resize: function (event_handler) {
                    elements.forEach(function (element) {
                        element.addEventListener('resize', event_handler);
                    });
                },

                click: function (event_handler) {
                    elements.forEach(function (element) {
                        element.addEventListener('click', event_handler);
                    });
                },

                submit: function (event_handler) {
                    elements.forEach(function (element) {
                        element.addEventListener('submit', event_handler);
                    });
                },

                change: function (event_handler) {
                    elements.forEach(function (element) {
                        element.addEventListener('change', event_handler);
                    });
                },

                keydown: function (event_handler) {
                    elements.forEach(function (element) {
                        element.addEventListener('keydown', event_handler);
                    });
                },

                keyup: function (event_handler) {
                    elements.forEach(function (element) {
                        element.addEventListener('keyup', event_handler);
                    });
                },

                mouseEnter: function (event_handler) {
                    elements.forEach(function (element) {
                        element.addEventListener('mouseenter', event_handler);
                    });
                },

                mouseLeave: function (event_handler) {
                    elements.forEach(function (element) {
                        element.addEventListener('mouseleave', event_handler);
                    });
                },

                hover: function (event_handler) {
                    elements.forEach(function (element) {
                        element.addEventListener('mouseover', event_handler);
                    });
                },

                text: function (text) {
                    elements.forEach(function (element) {
                        element.textContent = text;
                    });
                },

                addClass: function (classes_name) {
                    elements.forEach(function (element) {
                        var classes = classes_name.split(' ');
                        classes.forEach(function (single_class) {
                            if (element.classList) {
                                element.classList.add(single_class);
                            } else {
                                element.className += ' ' + single_class;
                            }
                        });

                    });
                },

                hasClass: function (class_name) {
                    if (elements.length > 1) {
                        var result;

                        elements.forEach(function (element) {
                            if (element.classList) {
                                result.push(element.classList.contains(class_name));
                            } else {
                                result.push(new RegExp('(^| )' + class_name + '( |$)', 'gi').test(element.className));
                            }
                        });
                        return result;
                    } else {
                        if (elements[0].classList) {
                            return elements[0].classList.contains(class_name);
                        } else {
                            return new RegExp('(^| )' + class_name + '( |$)', 'gi').test(elements[0].className);
                        }
                    }

                },

                removeClass: function (classes_name) {
                    elements.forEach(function (element) {
                        var classes = classes_name.split(' ');
                        classes.forEach(function (single_class) {
                            element.classList.remove(single_class);
                        });
                    });
                },

                id: function (id) {
                    elements.forEach(function (element) {
                        element.setAttribute('id', id);
                    });
                },

                attr: function (attribute, value) {

                    if (value == null) {
                        if (elements.length > 1) {
                            var attributes = [];
                            elements.forEach(function (element) {
                                attributes.push(element.getAttribute(attribute));
                            });
                            return attributes;
                        } else {
                            return elements[0].getAttribute(attribute);
                        }
                    }  else {
                        elements.forEach(function (element) {
                            element.setAttribute(attribute, value);
                        });
                    }
                },

                removeAttr: function (attribute) {
                    elements.forEach(function (element) {
                        element.removeAttribute(attribute);
                    });
                },

                action: function (path) {
                    elements.forEach(function (element) {
                        element.action = path;
                    });
                },

                source: function (source) {
                    elements.forEach(function (element) {
                        element.src = source;
                    });
                },

                alt: function (alt) {
                    elements.forEach(function (element) {
                        element.setAttribute('alt', alt);
                    });
                },


                each: function (func) {
                    elements.forEach(func);
                },

                empty: function () {
                    elements.forEach(function (element) {
                        element.innerHTML = '';
                    });
                },

                remove: function (child) {
                    elements.forEach(function (element) {
                        element.removeChild(child);
                    });
                },

                width: function (margin) {
                    if (elements.length > 1) {
                        var width_results;
                        elements.forEach(function (element) {
                            if (margin === false) {
                                width_results.push(element.offsetWidth);
                            } else {
                                var width = element.offsetWidth;
                                var style = getComputedStyle(element);

                                width += parseInt(style.marginLeft) + parseInt(style.marginRight);
                                width_results.push(width);
                            }
                        });
                        return width_results;
                    } else {

                        if (margin === false) {
                            return elements[0].offsetWidth;
                        } else {
                            var width = elements[0].offsetWidth;
                            var style = getComputedStyle(elements[0]);

                            width += parseInt(style.marginLeft) + parseInt(style.marginRight);
                            return width;
                        }
                    }

                },

                height: function (margin) {
                    if (elements.length > 1) {
                        var height_results;
                        elements.forEach(function (element) {
                            if (margin === false) {
                                height_results.push(element.offsetHeight);
                            } else {
                                var height = element.offsetHeight;
                                var style = getComputedStyle(element);

                                height += parseInt(style.marginLeft) + parseInt(style.marginRight);
                                height_results.push(height);
                            }
                        });
                        return height_results;
                    } else {
                        if (margin === false) {
                            return elements[0].offsetHeight;
                        } else {
                            var height = elements[0].offsetHeight;
                            var style = getComputedStyle(elements[0]);

                            height += parseInt(style.marginLeft) + parseInt(style.marginRight);
                            return height;
                        }
                    }
                },

                position: function () {

                    if (elements.length > 1) {
                        var offset;
                        elements.forEach(function (element) {

                            offset.push(
                                {left: element.offsetLeft, top: element.offsetTop}
                            );
                        });
                        return offset;
                    } else {
                        return {left: elements[0].offsetLeft, top: elements[0].offsetTop};
                    }
                },


                offset: function () {
                    if (elements.length > 1) {
                        var offset;
                        elements.forEach(function (element) {

                            var rect = element.getBoundingClientRect();

                            offset.push({
                                top: rect.top + document.body.scrollTop,
                                left: rect.left + document.body.scrollLeft
                            });
                        });
                        return offset;
                    } else {
                        var rect = elements[0].getBoundingClientRect();

                        return {
                            top: rect.top + document.body.scrollTop,
                            left: rect.left + document.body.scrollLeft
                        };
                    }

                },

                offsetParent: function () {
                    if (elements.length > 1) {
                        var offset;
                        elements.forEach(function (element) {
                            offset.push(element.offsetParent());
                        });
                        return offset;
                    } else {
                        return elements[0].offsetParent();
                    }

                },

                show: function () {
                    elements.forEach(function (element) {
                        element.style.display = '';
                    });
                },

                hide: function () {
                    elements.forEach(function (element) {
                        element.style.display = 'none';
                    });
                },

                fadeIn: function (delay) {

                    elements.forEach(function (element) {
                        Red.fadeIn(element, delay);
                    });
                },

                fadeOut: function (delay) {

                    elements.forEach(function (element) {
                        Red.fadeOut(element, delay);
                    });
                },
                play: function () {
                    elements.forEach(function (element) {
                        element.play();
                    });
                },
            };
        },

        online: function () {
            return navigator.onLine;
        },

        redirect: function(url){
            window.location.href = url;
        },

        user: function () {
            return navigator.userAgent;
        },

        IE: function(){
                var ua = window.navigator.userAgent;

                var msie = ua.indexOf('MSIE ');
                if (msie > 0) {
                    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
                }

                var trident = ua.indexOf('Trident/');
                if (trident > 0) {
                    var rv = ua.indexOf('rv:');
                    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
                }

                var edge = ua.indexOf('Edge/');
                if (edge > 0) {
                    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
                }


                return false;
        },

        goBack: function () {
            return window.history.back();
        },

        ajax: function (config) {

            var request = new XMLHttpRequest();

            request.onload = config.success;

            var method = config.type;
            var url = config.url;



            if (config.data != null) {

                var data = '';
                var data_keys = Object.keys(config.data);
                var data_values = Object.values(config.data);
                var data_keys_length = data_keys.length - 1;

                for (var counter = 0; counter <= data_keys_length; counter++) {
                    data += data_keys[counter] + '=' + data_values[counter];
                    if (counter !== data_keys_length) {
                        data += '&';
                    }
                }
            }


            request.open(method, url, true);

            if (config.contentType != null) {
                request.setRequestHeader('Content-Type', config.contentType + ';');
            }

            if (config.dataType != null) {
                request.responseType = config.dataType;
            }

            request.setRequestHeader('charset', 'UTF-8');
            request.setRequestHeader('AJAX-Request', 'RedJS_AJAX_Request');

            if (data != null){
                request.send(encodeURI(data));
            } else {
                request.send();
            }

        },

        parseJSON: function (string) {
            return JSON.parse(string);
        },

        parseHTML: function (string) {

            var temp = document.implementation.createHTMLDocument();
            temp.body.innerHTML = string;
            return temp.body.children;
        },

        setCookie: function (name, value, days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        },

        getCookie: function (name) {
            var name_equal = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(name_equal) === 0) return c.substring(name_equal.length, c.length);
            }
            return null;
        },

        deleteCookie: function (name) {
            Red.setCookie(name, '', -10);
        },


        fadeIn: function (element, delay) {

            if (!element) return false;

            element.style.opacity = 0;
            element.style.filter = "alpha(opacity=0)";
            element.style.display = "";

            if (delay) {
                var opacity = 0;
                var timer = setInterval(function () {
                    opacity += 50 / delay;
                    if (opacity >= 1) {
                        clearInterval(timer);
                        opacity = 1;
                    }
                    element.style.display = "";
                    element.style.opacity = opacity;
                    element.style.filter = "alpha(opacity=" + opacity * 100 + ")";
                }, 50);
            } else {
                element.style.opacity = 1;
                element.style.filter = "alpha(opacity=1)";
            }

        },

        fadeOut: function (element, delay) {


            if (!element) return false;


            if (delay) {
                var opacity = 1;
                var timer = setInterval(function () {
                    opacity -= 50 / delay;
                    if (opacity <= 0) {
                        clearInterval(timer);
                        opacity = 0;
                        element.style.display = "none";
                    }
                    element.style.opacity = opacity;
                    element.style.filter = "alpha(opacity=" + opacity * 100 + ")";
                }, 50);
            } else {
                element.style.opacity = 0;
                element.style.filter = "alpha(opacity=0)";
                element.style.display = "none";
            }
        },

        create: function (tag, parent, css_properties) {
            var element = document.createElement(tag);
            if (parent != null){
                this.select(parent).append(element)
            }

            if (css_properties != null){
                this.select(element).CSS(css_properties);
            }

            return element ;
        },

        each: function (array, func) {
            return array.forEach(func);
        },

        map: function (array, func) {
            return array.map(func);
        },


        inArray: function (item, array) {
            return array.indexOf(item);
        },

        isArray: function (array) {
            return Array.isArray(array);
        },

        type: function (object) {

            return Object.prototype.toString.call(object).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
        },

        now: function () {
            return Date.now();
        },

        timer: function (duration, element, method) {
            var start = Date.now(),
                diff,
                minutes,
                seconds;

            function timer() {

                diff = duration - (((Date.now() - start) / 1000) | 0);

                minutes = (diff / 60) | 0;
                seconds = (diff % 60) | 0;

                if (method === 'full') {
                    minutes = minutes < 10 ? "0" + minutes : minutes;
                    seconds = seconds < 10 ? "0" + seconds : seconds;
                    element.textContent = minutes + ":" + seconds;
                } else if (method === 'light') {
                    seconds = seconds < 10 ? "0" + seconds : seconds;
                    element.textContent = seconds;
                }


                if (diff <= 0) {
                    start = Date.now() + 1000;
                }
            }

            setInterval(timer, 1000);
        },


        autoComplete: function (input, input_container, list_element, item_element, array, not_found_message) {

            var queue = 0;

            Red.select(input).keyup(function () {

                closeList();

                var search_value = input.value, i;

                Red.select(input_container).append(list_element);

                Red.select(list_element).addClass('auto-complete-list');


                if (queue === 0) {
                    queue = 1000;
                    Red.fadeIn(list_element, 1000);
                } else {
                    setTimeout(function () {
                        queue = 0;
                    }, 1000);
                }


                var counter = 0;

                var array_length = array.length;


                for (i = 0; i < array_length; i++) {



                    if (array[i].substr(0, search_value.length) === search_value) {


                        let new_item_element = Red.select(item_element).clone();

                        Red.select(new_item_element).addClass('auto-complete-item');
                        Red.select(list_element).append(new_item_element);

                        new_item_element.innerHTML = array[i].substr(0, search_value.length);
                        new_item_element.innerHTML += array[i].substr(search_value.length);


                        new_item_element.innerHTML += "<input type='hidden' value='" + array[i] + "'>";
                        counter++;

                        Red.select(new_item_element).click(function () {
                            input.value = new_item_element.getElementsByTagName('input')[0].value;
                            closeList();
                        });

                        Red.select(list_element).append(new_item_element);

                    }


                }

                if (counter === 0) {
                    let new_item_element = Red.create('div');
                    Red.select(new_item_element).addClass('auto-complete-item');
                    Red.select(new_item_element).innerHTML(not_found_message);
                    Red.select(list_element).append(new_item_element);
                }

            });


            function closeList() {
                var list = Red.get('.auto-complete-list');
                var match_items = Red.select('.auto-complete-item').elements();


                if (list != null && match_items != null) {

                    var parent = Red.select(list).parent();

                    var match_items_length = match_items.length - 1;

                        for (var i = 0; i <= match_items_length; i++) {
                            Red.select(list).remove(match_items[i]);
                        }
                    Red.select(parent).remove(list);

                }
            }

            Red.select('body').click(function () {
                closeList();
            });
        },

        validate: function (string, attributes) {
            var attributes_in_array = attributes.split('|');
            var method = attributes_in_array[1].indexOf(':') + 1;
            method = attributes_in_array[1].substr(method, method.length);

            var limit = attributes_in_array[2].indexOf(':') + 1;
            limit = attributes_in_array[2].substr(limit, limit.length);

            limit = limit.split('-');

            var min = limit[0];
            var max = limit[1];

            var result;

            var validateServiceRules = this.validateServiceRules;
            Object.keys(validateServiceRules).forEach(function (key) {
                if (method == validateServiceRules[key]['rule']) {
                    var callback_func = validateServiceRules[key]['callback'];
                    result = callback_func(attributes_in_array[0], min, max, string);
                }
            });

            if (result === true || result === false) {
                return result;
            }

            if (attributes_in_array[0] === 'required') {


                if (method === 'digit') {

                    result = string.match(/^([0-9\n ])+$/g);


                    if (result == null) {
                        return false;
                    } else {
                        if (result[0].length >= min && result[0].length <= max) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                } else if (method === 'en') {

                    result = string.match(/^([a-zA-Z\n ])+$/g);


                    if (result == null) {
                        return false;
                    } else {
                        if (result[0].length >= min && result[0].length <= max) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                } else if (method === 'en_digit') {

                    result = string.match(/^([a-zA-Z0-9\n ])+$/g);


                    if (result == null) {
                        return false;
                    } else {
                        if (result[0].length >= min && result[0].length <= max) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                } else if (method === 'fa') {

                    result = string.match(/^([\n پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأءًٌٍَُِّ])+$/g);


                    if (result == null) {
                        return false;
                    } else {
                        if (result[0].length >= min && result[0].length <= max) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                } else if (method === 'fa_digit') {

                    result = string.match(/^([\n0-9 پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأءًٌٍَُِّ])+$/g);

                    if (result == null) {
                        return false;
                    } else {
                        if (result[0].length >= min && result[0].length <= max) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                } else if (method === 'mix') {
                    result = string.match(/^([a-zA-Z0-9\n پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأءًٌٍَُِّ])+$/g);


                } else if (method === 'text') {

                    result = string.match(/^([a-zA-Z0-9\.\-_,،;؛!?؟@\n پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأءًٌٍَُِّ])+$/g);

                } else if (method === 'text_en') {

                    result = string.match(/^([a-zA-Z0-9\.\-_,;!?@\n ])+$/g);

                } else if (method === 'text_fa') {

                    result = string.match(/^([0-9\.\-_,،;؛!?؟@\n پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأءًٌٍَُِّ])+$/g);

                } else if (method === 'email') {

                    result = string.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/gi);


                } else if (method === 'IP') {

                    result = string.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);

                    if (result == null) {
                        return false;
                    } else {
                        return true;
                    }

                } else if (method === 'username') {

                    result = string.match(/^([a-zA-Z0-9\.\-_])+$/);

                } else if (method === 'password') {

                    result = string.match(/^([a-zA-Z0-9\.*@])+$/);

                } else if (method === 'phone') {

                    result = string.match(/^([+]{0,1})([0-9])+$/);

                } else if (method === 'address') {

                    result = string.match(/^([a-zA-Z0-9\-\n پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأءًٌٍَُِّ])+$/);

                } else if (method === 'address_en') {

                    result = string.match(/^([a-zA-Z0-9\-\nّ ])+$/);

                } else if (method === 'address_fa') {


                    result = string.match(/^([0-9\-\n پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأءًٌٍَُِّ])+$/);

                }

                if (result == null) {
                    return false;
                } else {
                    if (result[0].length >= min && result[0].length <= max) {
                        return true;
                    } else {
                        return false;
                    }
                }


            } else if (attributes_in_array[0] === 'optional') {


                if (method === 'digit') {

                    result = string.match(/^([0-9\n ])*$/g);

                } else if (method === 'en') {

                    result = string.match(/^([a-zA-Z\n ])*$/g);

                } else if (method === 'en_digit') {

                    result = string.match(/^([a-zA-Z0-9\n ])*$/g);

                } else if (method === 'fa') {

                    result = string.match(/^([\n پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأءًٌٍَُِّ])*$/g);

                } else if (method === 'fa_digit') {

                    result = string.match(/^([\n0-9 پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأءًٌٍَُِّ])*$/g);

                } else if (method === 'mix') {

                    result = string.match(/^([a-zA-Z0-9\n پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأءًٌٍَُِّ])*$/g);

                } else if (method === 'text') {

                    result = string.match(/^([a-zA-Z0-9\.\-_,،;؛!?؟@\n پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأءًٌٍَُِّ])*$/g);

                } else if (method === 'text_en') {

                    result = string.match(/^([a-zA-Z0-9\.\-_,;!?@\n ])*$/g);

                } else if (method === 'text_fa') {

                    result = string.match(/^([0-9\.\-_,،;؛!؟@\n پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأءًٌٍَُِّ])*$/g);

                } else if (method === 'email') {

                    result = string.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/gi);

                } else if (method === 'IP') {

                    result = string.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);

                    if (result == null) {
                        if (string.length === 0) {
                            return true
                        } else {
                            return false;
                        }
                    } else {
                        if (string.length === 0) {
                            return true
                        } else {
                            return false;
                        }
                    }

                } else if (method === 'username') {

                    result = string.match(/^([a-zA-Z0-9\.\-_])*$/);

                } else if (method === 'password') {

                    result = string.match(/^([a-zA-Z0-9\.*@])*$/);

                } else if (method === 'phone') {

                    result = string.match(/^([+]{0,1})([0-9])*$/);

                } else if (method === 'address') {

                    result = string.match(/^([a-zA-Z0-9\-\n پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأءًٌٍَُِّ])*$/);

                } else if (method === 'address_en') {

                    result = string.match(/^([a-zA-Z0-9\-\nّ ])*$/);

                } else if (method === 'address_fa') {

                    result = string.match(/^([0-9\-\n پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأءًٌٍَُِّ])*$/);

                }

                if (result == null) {
                    if (string.length === 0) {
                        return true
                    } else {
                        return false;
                    }
                } else {
                    if (result[0].length >= min && result[0].length <= max) {
                        return true;
                    } else {
                        if (string.length === 0) {
                            return true
                        } else {
                            return false;
                        }
                    }
                }

            }
        },

        addValidateRule: function (rule, callback) {
            this.validateServiceRules.push({'rule': rule, 'callback': callback});
        },

        filter: function (string, method) {
            if (method === 'digit') {

                return string.replace(/[^0-9\n ]/gim, '');

            } else if (method === 'en') {

                return string.replace(/[^a-zA-Z\n ]/gim, '');

            } else if (method === 'en_digit') {

                return string.replace(/[^a-zA-Z0-9\n ]/gim, '');

            } else if (method === 'fa') {

                return string.replace(/[^\n پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأءًٌٍَُِّ]/gim, '');

            } else if (method === 'fa_digit') {

                return string.replace(/[^\n0-9 پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأءًٌٍَُِّ]/gim, '');

            } else if (method === 'mix') {

                return string.replace(/[^a-zA-Z0-9\n پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأء]/gim, '');

            } else if (method === 'text') {

                return string.replace(/[^a-zA-Z0-9\.\-_,،;؛!?؟@\n پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأء]/gim, '');

            } else if (method === 'text_en') {

                return string.replace(/[^a-zA-Z0-9\.\-_,;!?@\n ]/gim, '');

            } else if (method === 'text_fa') {

                return string.replace(/[^0-9\.\-_,،;؛!؟@\n پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأء]/gim, '');

            } else if (method === 'email') {

                return string.replace(/[^a-zA-Z0-9@]/gim, '');

            } else if (method === 'IP') {

                return string.replace(/[^0-9.]/gim, '');

            } else if (method === 'username') {

                return string.replace(/[^a-zA-Z0-9\.\-_]/gim, '');

            } else if (method === 'password') {

                return string.replace(/[^a-zA-Z0-9\.*@]/gim, '');

            } else if (method === 'phone') {

                return string.replace(/[^0-9+]/gim, '');

            } else if (method === 'address') {

                return string.replace(/[^a-zA-Z0-9\-\n پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأء]/gim, '');

            } else if (method === 'address_en') {

                return string.replace(/[^a-zA-Z0-9\-\n]/gim, '');

            } else if (method === 'address_fa') {

                return string.replace(/[^0-9\-\n پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأء]/gim, '');

            }

            var filterServiceRules = this.filterServiceRules;
            Object.keys(filterServiceRules).forEach(function (key) {
                if (method == filterServiceRules[key]['rule']) {
                    var callback_func = filterServiceRules[key]['callback'];
                    string = callback_func(string);
                }
            });

            return string;
        },

        addFilterRule: function (rule, callback) {
            this.filterServiceRules.push({'rule': rule, 'callback': callback});
        },

        sanitize: function (string, method) {
            if (method === 'digit') {
                return string.replace(/([0-9])+/);
            } else if (method === 'space') {
                return string.replace(/(\s\n)+/);
            }

            var sanitizeServiceRules = this.sanitizeServiceRules;
            Object.keys(sanitizeServiceRules).forEach(function (key) {
                if (method == sanitizeServiceRules[key]['rule']) {
                    var callback_func = sanitizeServiceRules[key]['callback'];
                    string = callback_func(string);
                }
            });

            return string;
        },

        addSanitizeRule: function (rule, callback) {
            this.sanitizeServiceRules.push({'rule': rule, 'callback': callback});
        },

        trim: function (string) {
            return string.trim();
        },


        generateRandomInt: function getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

    }
;