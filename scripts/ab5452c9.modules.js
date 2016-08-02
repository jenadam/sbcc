!function(a, b, c) {
    "use strict";
    function d(a) {
        return null != a && "" !== a && "hasOwnProperty" !== a && h.test("." + a)
    }
    function e(a, b) {
        if (!d(b))
            throw g("badmember", 'Dotted member path "@{0}" is invalid.', b);
        for (var e = b.split("."), f = 0, h = e.length; h > f && a !== c; f++) {
            var i = e[f];
            a = null !== a ? a[i] : c
        }
        return a
    }
    function f(a, c) {
        c = c || {},
        b.forEach(c, function(a, b) {
            delete c[b]
        });
        for (var d in a)
            !a.hasOwnProperty(d) || "$" === d.charAt(0) && "$" === d.charAt(1) || (c[d] = a[d]);
        return c
    }
    var g = b.$$minErr("$resource")
      , h = /^(\.[a-zA-Z_$][0-9a-zA-Z_$]*)+$/;
    b.module("ngResource", ["ng"]).factory("$resource", ["$http", "$q", function(a, d) {
        function h(a) {
            return i(a, !0).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+")
        }
        function i(a, b) {
            return encodeURIComponent(a).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, b ? "%20" : "+")
        }
        function j(a, b) {
            this.template = a,
            this.defaults = b || {},
            this.urlParams = {}
        }
        function k(h, i, r) {
            function s(a, b) {
                var c = {};
                return b = o({}, i, b),
                n(b, function(b, d) {
                    q(b) && (b = b()),
                    c[d] = b && b.charAt && "@" == b.charAt(0) ? e(a, b.substr(1)) : b
                }),
                c
            }
            function t(a) {
                return a.resource
            }
            function u(a) {
                f(a || {}, this)
            }
            var v = new j(h);
            return r = o({}, l, r),
            n(r, function(e, h) {
                var i = /^(POST|PUT|PATCH)$/i.test(e.method);
                u[h] = function(h, j, k, l) {
                    var r, w, x, y = {};
                    switch (arguments.length) {
                    case 4:
                        x = l,
                        w = k;
                    case 3:
                    case 2:
                        if (!q(j)) {
                            y = h,
                            r = j,
                            w = k;
                            break
                        }
                        if (q(h)) {
                            w = h,
                            x = j;
                            break
                        }
                        w = j,
                        x = k;
                    case 1:
                        q(h) ? w = h : i ? r = h : y = h;
                        break;
                    case 0:
                        break;
                    default:
                        throw g("badargs", "Expected up to 4 arguments [params, data, success, error], got {0} arguments", arguments.length)
                    }
                    var z = this instanceof u
                      , A = z ? r : e.isArray ? [] : new u(r)
                      , B = {}
                      , C = e.interceptor && e.interceptor.response || t
                      , D = e.interceptor && e.interceptor.responseError || c;
                    n(e, function(a, b) {
                        "params" != b && "isArray" != b && "interceptor" != b && (B[b] = p(a))
                    }),
                    i && (B.data = r),
                    v.setUrlParams(B, o({}, s(r, e.params || {}), y), e.url);
                    var E = a(B).then(function(a) {
                        var c = a.data
                          , d = A.$promise;
                        if (c) {
                            if (b.isArray(c) !== !!e.isArray)
                                throw g("badcfg", "Error in resource configuration. Expected response to contain an {0} but got an {1}", e.isArray ? "array" : "object", b.isArray(c) ? "array" : "object");
                            e.isArray ? (A.length = 0,
                            n(c, function(a) {
                                A.push("object" == typeof a ? new u(a) : a)
                            })) : (f(c, A),
                            A.$promise = d)
                        }
                        return A.$resolved = !0,
                        a.resource = A,
                        a
                    }, function(a) {
                        return A.$resolved = !0,
                        (x || m)(a),
                        d.reject(a)
                    });
                    return E = E.then(function(a) {
                        var b = C(a);
                        return (w || m)(b, a.headers),
                        b
                    }, D),
                    z ? E : (A.$promise = E,
                    A.$resolved = !1,
                    A)
                }
                ,
                u.prototype["$" + h] = function(a, b, c) {
                    q(a) && (c = b,
                    b = a,
                    a = {});
                    var d = u[h].call(this, a, this, b, c);
                    return d.$promise || d
                }
            }),
            u.bind = function(a) {
                return k(h, o({}, i, a), r)
            }
            ,
            u
        }
        var l = {
            get: {
                method: "GET"
            },
            save: {
                method: "POST"
            },
            query: {
                method: "GET",
                isArray: !0
            },
            remove: {
                method: "DELETE"
            },
            "delete": {
                method: "DELETE"
            }
        }
          , m = b.noop
          , n = b.forEach
          , o = b.extend
          , p = b.copy
          , q = b.isFunction;
        return j.prototype = {
            setUrlParams: function(a, c, d) {
                var e, f, i = this, j = d || i.template, k = i.urlParams = {};
                n(j.split(/\W/), function(a) {
                    if ("hasOwnProperty" === a)
                        throw g("badname", "hasOwnProperty is not a valid parameter name.");
                    !new RegExp("^\\d+$").test(a) && a && new RegExp("(^|[^\\\\]):" + a + "(\\W|$)").test(j) && (k[a] = !0)
                }),
                j = j.replace(/\\:/g, ":"),
                c = c || {},
                n(i.urlParams, function(a, d) {
                    e = c.hasOwnProperty(d) ? c[d] : i.defaults[d],
                    b.isDefined(e) && null !== e ? (f = h(e),
                    j = j.replace(new RegExp(":" + d + "(\\W|$)","g"), function(a, b) {
                        return f + b
                    })) : j = j.replace(new RegExp("(/?):" + d + "(\\W|$)","g"), function(a, b, c) {
                        return "/" == c.charAt(0) ? c : b + c
                    })
                }),
                j = j.replace(/\/+$/, "") || "/",
                j = j.replace(/\/\.(?=\w+($|\?))/, "."),
                a.url = j.replace(/\/\\\./, "/."),
                n(c, function(b, c) {
                    i.urlParams[c] || (a.params = a.params || {},
                    a.params[c] = b)
                })
            }
        },
        k
    }
    ])
}(window, window.angular),
function(a, b, c) {
    "use strict";
    b.module("ngCookies", ["ng"]).factory("$cookies", ["$rootScope", "$browser", function(a, d) {
        function e() {
            var a, e, f, i;
            for (a in h)
                k(g[a]) && d.cookies(a, c);
            for (a in g)
                e = g[a],
                b.isString(e) || (e = "" + e,
                g[a] = e),
                e !== h[a] && (d.cookies(a, e),
                i = !0);
            if (i) {
                i = !1,
                f = d.cookies();
                for (a in g)
                    g[a] !== f[a] && (k(f[a]) ? delete g[a] : g[a] = f[a],
                    i = !0)
            }
        }
        var f, g = {}, h = {}, i = !1, j = b.copy, k = b.isUndefined;
        return d.addPollFn(function() {
            var b = d.cookies();
            f != b && (f = b,
            j(b, h),
            j(b, g),
            i && a.$apply())
        })(),
        i = !0,
        a.$watch(e),
        g
    }
    ]).factory("$cookieStore", ["$cookies", function(a) {
        return {
            get: function(c) {
                var d = a[c];
                return d ? b.fromJson(d) : d
            },
            put: function(c, d) {
                a[c] = b.toJson(d)
            },
            remove: function(b) {
                delete a[b]
            }
        }
    }
    ])
}(window, window.angular),
function(a, b) {
    "use strict";
    function c() {
        this.$get = ["$$sanitizeUri", function(a) {
            return function(b) {
                var c = [];
                return f(b, i(c, function(b, c) {
                    return !/^unsafe/.test(a(b, c))
                })),
                c.join("")
            }
        }
        ]
    }
    function d(a) {
        var c = []
          , d = i(c, b.noop);
        return d.chars(a),
        c.join("")
    }
    function e(a) {
        var b, c = {}, d = a.split(",");
        for (b = 0; b < d.length; b++)
            c[d[b]] = !0;
        return c
    }
    function f(a, c) {
        function d(a, d, f, h) {
            if (d = b.lowercase(d),
            y[d])
                for (; t.last() && z[t.last()]; )
                    e("", t.last());
            x[d] && t.last() == d && e("", d),
            h = u[d] || !!h,
            h || t.push(d);
            var i = {};
            f.replace(m, function(a, b, c, d, e) {
                var f = c || d || e || "";
                i[b] = g(f)
            }),
            c.start && c.start(d, i, h)
        }
        function e(a, d) {
            var e, f = 0;
            if (d = b.lowercase(d))
                for (f = t.length - 1; f >= 0 && t[f] != d; f--)
                    ;
            if (f >= 0) {
                for (e = t.length - 1; e >= f; e--)
                    c.end && c.end(t[e]);
                t.length = f
            }
        }
        "string" != typeof a && (a = null === a || "undefined" == typeof a ? "" : "" + a);
        var f, h, i, s, t = [], v = a;
        for (t.last = function() {
            return t[t.length - 1]
        }
        ; a; ) {
            if (s = "",
            h = !0,
            t.last() && A[t.last()] ? (a = a.replace(new RegExp("(.*)<\\s*\\/\\s*" + t.last() + "[^>]*>","i"), function(a, b) {
                return b = b.replace(p, "$1").replace(r, "$1"),
                c.chars && c.chars(g(b)),
                ""
            }),
            e("", t.last())) : (0 === a.indexOf("<!--") ? (f = a.indexOf("--", 4),
            f >= 0 && a.lastIndexOf("-->", f) === f && (c.comment && c.comment(a.substring(4, f)),
            a = a.substring(f + 3),
            h = !1)) : q.test(a) ? (i = a.match(q),
            i && (a = a.replace(i[0], ""),
            h = !1)) : o.test(a) ? (i = a.match(l),
            i && (a = a.substring(i[0].length),
            i[0].replace(l, e),
            h = !1)) : n.test(a) && (i = a.match(k),
            i ? (i[4] && (a = a.substring(i[0].length),
            i[0].replace(k, d)),
            h = !1) : (s += "<",
            a = a.substring(1))),
            h && (f = a.indexOf("<"),
            s += 0 > f ? a : a.substring(0, f),
            a = 0 > f ? "" : a.substring(f),
            c.chars && c.chars(g(s)))),
            a == v)
                throw j("badparse", "The sanitizer was unable to parse the following block of html: {0}", a);
            v = a
        }
        e()
    }
    function g(a) {
        if (!a)
            return "";
        var b = F.exec(a)
          , c = b[1]
          , d = b[3]
          , e = b[2];
        return e && (E.innerHTML = e.replace(/</g, "&lt;"),
        e = "textContent"in E ? E.textContent : E.innerText),
        c + e + d
    }
    function h(a) {
        return a.replace(/&/g, "&amp;").replace(s, function(a) {
            var b = a.charCodeAt(0)
              , c = a.charCodeAt(1);
            return "&#" + (1024 * (b - 55296) + (c - 56320) + 65536) + ";"
        }).replace(t, function(a) {
            return "&#" + a.charCodeAt(0) + ";"
        }).replace(/</g, "&lt;").replace(/>/g, "&gt;")
    }
    function i(a, c) {
        var d = !1
          , e = b.bind(a, a.push);
        return {
            start: function(a, f, g) {
                a = b.lowercase(a),
                !d && A[a] && (d = a),
                d || B[a] !== !0 || (e("<"),
                e(a),
                b.forEach(f, function(d, f) {
                    var g = b.lowercase(f)
                      , i = "img" === a && "src" === g || "background" === g;
                    D[g] !== !0 || C[g] === !0 && !c(d, i) || (e(" "),
                    e(f),
                    e('="'),
                    e(h(d)),
                    e('"'))
                }),
                e(g ? "/>" : ">"))
            },
            end: function(a) {
                a = b.lowercase(a),
                d || B[a] !== !0 || (e("</"),
                e(a),
                e(">")),
                a == d && (d = !1)
            },
            chars: function(a) {
                d || e(h(a))
            }
        }
    }
    var j = b.$$minErr("$sanitize")
      , k = /^<((?:[a-zA-Z])[\w:-]*)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*(>?)/
      , l = /^<\/\s*([\w:-]+)[^>]*>/
      , m = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g
      , n = /^</
      , o = /^<\//
      , p = /<!--(.*?)-->/g
      , q = /<!DOCTYPE([^>]*?)>/i
      , r = /<!\[CDATA\[(.*?)]]>/g
      , s = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
      , t = /([^\#-~| |!])/g
      , u = e("area,br,col,hr,img,wbr")
      , v = e("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr")
      , w = e("rp,rt")
      , x = b.extend({}, w, v)
      , y = b.extend({}, v, e("address,article,aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul"))
      , z = b.extend({}, w, e("a,abbr,acronym,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,samp,small,span,strike,strong,sub,sup,time,tt,u,var"))
      , A = e("script,style")
      , B = b.extend({}, u, y, z, x)
      , C = e("background,cite,href,longdesc,src,usemap")
      , D = b.extend({}, C, e("abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,scope,scrolling,shape,size,span,start,summary,target,title,type,valign,value,vspace,width"))
      , E = document.createElement("pre")
      , F = /^(\s*)([\s\S]*?)(\s*)$/;
    b.module("ngSanitize", []).provider("$sanitize", c),
    b.module("ngSanitize").filter("linky", ["$sanitize", function(a) {
        var c = /((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"]/
          , e = /^mailto:/;
        return function(f, g) {
            function h(a) {
                a && n.push(d(a))
            }
            function i(a, c) {
                n.push("<a "),
                b.isDefined(g) && (n.push('target="'),
                n.push(g),
                n.push('" ')),
                n.push('href="'),
                n.push(a),
                n.push('">'),
                h(c),
                n.push("</a>")
            }
            if (!f)
                return f;
            for (var j, k, l, m = f, n = []; j = m.match(c); )
                k = j[0],
                j[2] == j[3] && (k = "mailto:" + k),
                l = j.index,
                h(m.substr(0, l)),
                i(k, j[0].replace(e, "")),
                m = m.substring(l + j[0].length);
            return h(m),
            a(n.join(""))
        }
    }
    ])
}(window, window.angular),
function(a, b) {
    "use strict";
    function c() {
        function a(a, c) {
            return b.extend(new (b.extend(function() {}, {
                prototype: a
            })), c)
        }
        function c(a, b) {
            var c = b.caseInsensitiveMatch
              , d = {
                originalPath: a,
                regexp: a
            }
              , e = d.keys = [];
            return a = a.replace(/([().])/g, "\\$1").replace(/(\/)?:(\w+)([\?\*])?/g, function(a, b, c, d) {
                var f = "?" === d ? d : null
                  , g = "*" === d ? d : null ;
                return e.push({
                    name: c,
                    optional: !!f
                }),
                b = b || "",
                "" + (f ? "" : b) + "(?:" + (f ? b : "") + (g && "(.+?)" || "([^/]+)") + (f || "") + ")" + (f || "")
            }).replace(/([\/$\*])/g, "\\$1"),
            d.regexp = new RegExp("^" + a + "$",c ? "i" : ""),
            d
        }
        var d = {};
        this.when = function(a, e) {
            if (d[a] = b.extend({
                reloadOnSearch: !0
            }, e, a && c(a, e)),
            a) {
                var f = "/" == a[a.length - 1] ? a.substr(0, a.length - 1) : a + "/";
                d[f] = b.extend({
                    redirectTo: a
                }, c(f, e))
            }
            return this
        }
        ,
        this.otherwise = function(a) {
            return this.when(null , a),
            this
        }
        ,
        this.$get = ["$rootScope", "$location", "$routeParams", "$q", "$injector", "$http", "$templateCache", "$sce", function(c, e, f, g, h, i, j, k) {
            function l(a, b) {
                var c = b.keys
                  , d = {};
                if (!b.regexp)
                    return null ;
                var e = b.regexp.exec(a);
                if (!e)
                    return null ;
                for (var f = 1, g = e.length; g > f; ++f) {
                    var h = c[f - 1]
                      , i = e[f];
                    h && i && (d[h.name] = i)
                }
                return d
            }
            function m() {
                var a = n()
                  , d = q.current;
                a && d && a.$$route === d.$$route && b.equals(a.pathParams, d.pathParams) && !a.reloadOnSearch && !p ? (d.params = a.params,
                b.copy(d.params, f),
                c.$broadcast("$routeUpdate", d)) : (a || d) && (p = !1,
                c.$broadcast("$routeChangeStart", a, d),
                q.current = a,
                a && a.redirectTo && (b.isString(a.redirectTo) ? e.path(o(a.redirectTo, a.params)).search(a.params).replace() : e.url(a.redirectTo(a.pathParams, e.path(), e.search())).replace()),
                g.when(a).then(function() {
                    if (a) {
                        var c, d, e = b.extend({}, a.resolve);
                        return b.forEach(e, function(a, c) {
                            e[c] = b.isString(a) ? h.get(a) : h.invoke(a)
                        }),
                        b.isDefined(c = a.template) ? b.isFunction(c) && (c = c(a.params)) : b.isDefined(d = a.templateUrl) && (b.isFunction(d) && (d = d(a.params)),
                        d = k.getTrustedResourceUrl(d),
                        b.isDefined(d) && (a.loadedTemplateUrl = d,
                        c = i.get(d, {
                            cache: j
                        }).then(function(a) {
                            return a.data
                        }))),
                        b.isDefined(c) && (e.$template = c),
                        g.all(e)
                    }
                }).then(function(e) {
                    a == q.current && (a && (a.locals = e,
                    b.copy(a.params, f)),
                    c.$broadcast("$routeChangeSuccess", a, d))
                }, function(b) {
                    a == q.current && c.$broadcast("$routeChangeError", a, d, b)
                }))
            }
            function n() {
                var c, f;
                return b.forEach(d, function(d) {
                    !f && (c = l(e.path(), d)) && (f = a(d, {
                        params: b.extend({}, e.search(), c),
                        pathParams: c
                    }),
                    f.$$route = d)
                }),
                f || d[null ] && a(d[null ], {
                    params: {},
                    pathParams: {}
                })
            }
            function o(a, c) {
                var d = [];
                return b.forEach((a || "").split(":"), function(a, b) {
                    if (0 === b)
                        d.push(a);
                    else {
                        var e = a.match(/(\w+)(.*)/)
                          , f = e[1];
                        d.push(c[f]),
                        d.push(e[2] || ""),
                        delete c[f]
                    }
                }),
                d.join("")
            }
            var p = !1
              , q = {
                routes: d,
                reload: function() {
                    p = !0,
                    c.$evalAsync(m)
                }
            };
            return c.$on("$locationChangeSuccess", m),
            q
        }
        ]
    }
    function d() {
        this.$get = function() {
            return {}
        }
    }
    function e(a, c, d) {
        return {
            restrict: "ECA",
            terminal: !0,
            priority: 400,
            transclude: "element",
            link: function(e, f, g, h, i) {
                function j() {
                    n && (n.remove(),
                    n = null ),
                    l && (l.$destroy(),
                    l = null ),
                    m && (d.leave(m, function() {
                        n = null
                    }),
                    n = m,
                    m = null )
                }
                function k() {
                    var g = a.current && a.current.locals
                      , h = g && g.$template;
                    if (b.isDefined(h)) {
                        var k = e.$new()
                          , n = a.current
                          , q = i(k, function(a) {
                            d.enter(a, null , m || f, function() {
                                !b.isDefined(o) || o && !e.$eval(o) || c()
                            }),
                            j()
                        });
                        m = q,
                        l = n.scope = k,
                        l.$emit("$viewContentLoaded"),
                        l.$eval(p)
                    } else
                        j()
                }
                var l, m, n, o = g.autoscroll, p = g.onload || "";
                e.$on("$routeChangeSuccess", k),
                k()
            }
        }
    }
    function f(a, b, c) {
        return {
            restrict: "ECA",
            priority: -400,
            link: function(d, e) {
                var f = c.current
                  , g = f.locals;
                e.html(g.$template);
                var h = a(e.contents());
                if (f.controller) {
                    g.$scope = d;
                    var i = b(f.controller, g);
                    f.controllerAs && (d[f.controllerAs] = i),
                    e.data("$ngControllerController", i),
                    e.children().data("$ngControllerController", i)
                }
                h(d)
            }
        }
    }
    var g = b.module("ngRoute", ["ng"]).provider("$route", c);
    g.provider("$routeParams", d),
    g.directive("ngView", e),
    g.directive("ngView", f),
    e.$inject = ["$route", "$anchorScroll", "$animate"],
    f.$inject = ["$compile", "$controller", "$route"]
}(window, window.angular),
function(a, b, c) {
    "use strict";
    b.module("ngAnimate", ["ng"]).directive("ngAnimateChildren", function() {
        var a = "$$ngAnimateChildren";
        return function(c, d, e) {
            var f = e.ngAnimateChildren;
            b.isString(f) && 0 === f.length ? d.data(a, !0) : c.$watch(f, function(b) {
                d.data(a, !!b)
            })
        }
    }).factory("$$animateReflow", ["$$rAF", "$document", function(a, b) {
        var c = b[0].body;
        return function(b) {
            return a(function() {
                c.offsetWidth + 1;
                b()
            })
        }
    }
    ]).config(["$provide", "$animateProvider", function(d, e) {
        function f(a) {
            for (var b = 0; b < a.length; b++) {
                var c = a[b];
                if (c.nodeType == m)
                    return c
            }
        }
        function g(a) {
            return a && b.element(a)
        }
        function h(a) {
            return b.element(f(a))
        }
        function i(a, b) {
            return f(a) == f(b)
        }
        var j = b.noop
          , k = b.forEach
          , l = e.$$selectors
          , m = 1
          , n = "$$ngAnimateState"
          , o = "$$ngAnimateChildren"
          , p = "ng-animate"
          , q = {
            running: !0
        };
        d.decorator("$animate", ["$delegate", "$injector", "$sniffer", "$rootElement", "$$asyncCallback", "$rootScope", "$document", function(a, c, d, m, r, s) {
            function t(a) {
                var b = a.data(n) || {};
                b.running = !0,
                a.data(n, b)
            }
            function u(a) {
                if (a) {
                    var b = []
                      , e = {}
                      , f = a.substr(1).split(".");
                    (d.transitions || d.animations) && b.push(c.get(l[""]));
                    for (var g = 0; g < f.length; g++) {
                        var h = f[g]
                          , i = l[h];
                        i && !e[h] && (b.push(c.get(i)),
                        e[h] = !0)
                    }
                    return b
                }
            }
            function v(a, c, d) {
                function e(a, b) {
                    var c = a[b]
                      , d = a["before" + b.charAt(0).toUpperCase() + b.substr(1)];
                    return c || d ? ("leave" == b && (d = c,
                    c = null ),
                    v.push({
                        event: b,
                        fn: c
                    }),
                    r.push({
                        event: b,
                        fn: d
                    }),
                    !0) : void 0
                }
                function f(b, c, e) {
                    function f(a) {
                        if (c) {
                            if ((c[a] || j)(),
                            ++l < g.length)
                                return;
                            c = null
                        }
                        e()
                    }
                    var g = [];
                    k(b, function(a) {
                        a.fn && g.push(a)
                    });
                    var l = 0;
                    k(g, function(b, e) {
                        var g = function() {
                            f(e)
                        }
                        ;
                        switch (b.event) {
                        case "setClass":
                            c.push(b.fn(a, h, i, g));
                            break;
                        case "addClass":
                            c.push(b.fn(a, h || d, g));
                            break;
                        case "removeClass":
                            c.push(b.fn(a, i || d, g));
                            break;
                        default:
                            c.push(b.fn(a, g))
                        }
                    }),
                    c && 0 === c.length && e()
                }
                var g = a[0];
                if (g) {
                    var h, i, l = "setClass" == c, m = l || "addClass" == c || "removeClass" == c;
                    b.isArray(d) && (h = d[0],
                    i = d[1],
                    d = h + " " + i);
                    var n = a.attr("class")
                      , o = n + " " + d;
                    if (C(o)) {
                        var p = j
                          , q = []
                          , r = []
                          , s = j
                          , t = []
                          , v = []
                          , w = (" " + o).replace(/\s+/g, ".");
                        return k(u(w), function(a) {
                            var b = e(a, c);
                            !b && l && (e(a, "addClass"),
                            e(a, "removeClass"))
                        }),
                        {
                            node: g,
                            event: c,
                            className: d,
                            isClassBased: m,
                            isSetClassOperation: l,
                            before: function(a) {
                                p = a,
                                f(r, q, function() {
                                    p = j,
                                    a()
                                })
                            },
                            after: function(a) {
                                s = a,
                                f(v, t, function() {
                                    s = j,
                                    a()
                                })
                            },
                            cancel: function() {
                                q && (k(q, function(a) {
                                    (a || j)(!0)
                                }),
                                p(!0)),
                                t && (k(t, function(a) {
                                    (a || j)(!0)
                                }),
                                s(!0))
                            }
                        }
                    }
                }
            }
            function w(a, c, d, e, f, g, h) {
                function i(b) {
                    var e = "$animate:" + b;
                    t && t[e] && t[e].length > 0 && r(function() {
                        d.triggerHandler(e, {
                            event: a,
                            className: c
                        })
                    })
                }
                function j() {
                    i("before")
                }
                function l() {
                    i("after")
                }
                function m() {
                    i("close"),
                    h && r(function() {
                        h()
                    })
                }
                function o() {
                    o.hasBeenRun || (o.hasBeenRun = !0,
                    g())
                }
                function q() {
                    if (!q.hasBeenRun) {
                        q.hasBeenRun = !0;
                        var b = d.data(n);
                        b && (s && s.isClassBased ? y(d, c) : (r(function() {
                            var b = d.data(n) || {};
                            H == b.index && y(d, c, a)
                        }),
                        d.data(n, b))),
                        m()
                    }
                }
                var s = v(d, a, c);
                if (!s)
                    return o(),
                    j(),
                    l(),
                    void q();
                c = s.className;
                var t = b.element._data(s.node);
                t = t && t.events,
                e || (e = f ? f.parent() : d.parent());
                var u, w = d.data(n) || {}, x = w.active || {}, B = w.totalActive || 0, C = w.last;
                if (s.isClassBased && (u = w.running || w.disabled || C && !C.isClassBased),
                u || z(d, e))
                    return o(),
                    j(),
                    l(),
                    void q();
                var D = !1;
                if (B > 0) {
                    var E = [];
                    if (s.isClassBased) {
                        if ("setClass" == C.event)
                            E.push(C),
                            y(d, c);
                        else if (x[c]) {
                            var F = x[c];
                            F.event == a ? D = !0 : (E.push(F),
                            y(d, c))
                        }
                    } else if ("leave" == a && x["ng-leave"])
                        D = !0;
                    else {
                        for (var G in x)
                            E.push(x[G]),
                            y(d, G);
                        x = {},
                        B = 0
                    }
                    E.length > 0 && k(E, function(a) {
                        a.cancel()
                    })
                }
                if (!s.isClassBased || s.isSetClassOperation || D || (D = "addClass" == a == d.hasClass(c)),
                D)
                    return o(),
                    j(),
                    l(),
                    void m();
                "leave" == a && d.one("$destroy", function() {
                    var a = b.element(this)
                      , c = a.data(n);
                    if (c) {
                        var d = c.active["ng-leave"];
                        d && (d.cancel(),
                        y(a, "ng-leave"))
                    }
                }),
                d.addClass(p);
                var H = A++;
                B++,
                x[c] = s,
                d.data(n, {
                    last: s,
                    active: x,
                    index: H,
                    totalActive: B
                }),
                j(),
                s.before(function(b) {
                    var e = d.data(n);
                    b = b || !e || !e.active[c] || s.isClassBased && e.active[c].event != a,
                    o(),
                    b === !0 ? q() : (l(),
                    s.after(q))
                })
            }
            function x(a) {
                var c = f(a);
                if (c) {
                    var d = b.isFunction(c.getElementsByClassName) ? c.getElementsByClassName(p) : c.querySelectorAll("." + p);
                    k(d, function(a) {
                        a = b.element(a);
                        var c = a.data(n);
                        c && c.active && k(c.active, function(a) {
                            a.cancel()
                        })
                    })
                }
            }
            function y(a, b) {
                if (i(a, m))
                    q.disabled || (q.running = !1,
                    q.structural = !1);
                else if (b) {
                    var c = a.data(n) || {}
                      , d = b === !0;
                    !d && c.active && c.active[b] && (c.totalActive--,
                    delete c.active[b]),
                    (d || !c.totalActive) && (a.removeClass(p),
                    a.removeData(n))
                }
            }
            function z(a, c) {
                if (q.disabled)
                    return !0;
                if (i(a, m))
                    return q.running;
                var d, e, f;
                do {
                    if (0 === c.length)
                        break;
                    var g = i(c, m)
                      , h = g ? q : c.data(n) || {};
                    if (h.disabled)
                        return !0;
                    if (g && (f = !0),
                    d !== !1) {
                        var j = c.data(o);
                        b.isDefined(j) && (d = j)
                    }
                    e = e || h.running || h.last && !h.last.isClassBased
                } while (c = c.parent());return !f || !d && e
            }
            var A = 0;
            m.data(n, q),
            s.$$postDigest(function() {
                s.$$postDigest(function() {
                    q.running = !1
                })
            });
            var B = e.classNameFilter()
              , C = B ? function(a) {
                return B.test(a)
            }
            : function() {
                return !0
            }
            ;
            return {
                enter: function(c, d, e, f) {
                    c = b.element(c),
                    d = g(d),
                    e = g(e),
                    t(c),
                    a.enter(c, d, e),
                    s.$$postDigest(function() {
                        c = h(c),
                        w("enter", "ng-enter", c, d, e, j, f)
                    })
                },
                leave: function(c, d) {
                    c = b.element(c),
                    x(c),
                    t(c),
                    s.$$postDigest(function() {
                        w("leave", "ng-leave", h(c), null , null , function() {
                            a.leave(c)
                        }, d)
                    })
                },
                move: function(c, d, e, f) {
                    c = b.element(c),
                    d = g(d),
                    e = g(e),
                    x(c),
                    t(c),
                    a.move(c, d, e),
                    s.$$postDigest(function() {
                        c = h(c),
                        w("move", "ng-move", c, d, e, j, f)
                    })
                },
                addClass: function(c, d, e) {
                    c = b.element(c),
                    c = h(c),
                    w("addClass", d, c, null , null , function() {
                        a.addClass(c, d)
                    }, e)
                },
                removeClass: function(c, d, e) {
                    c = b.element(c),
                    c = h(c),
                    w("removeClass", d, c, null , null , function() {
                        a.removeClass(c, d)
                    }, e)
                },
                setClass: function(c, d, e, f) {
                    c = b.element(c),
                    c = h(c),
                    w("setClass", [d, e], c, null , null , function() {
                        a.setClass(c, d, e)
                    }, f)
                },
                enabled: function(a, b) {
                    switch (arguments.length) {
                    case 2:
                        if (a)
                            y(b);
                        else {
                            var c = b.data(n) || {};
                            c.disabled = !0,
                            b.data(n, c)
                        }
                        break;
                    case 1:
                        q.disabled = !a;
                        break;
                    default:
                        a = !q.disabled
                    }
                    return !!a
                }
            }
        }
        ]),
        e.register("", ["$window", "$sniffer", "$timeout", "$$animateReflow", function(d, e, g, h) {
            function i(a, b) {
                J && J(),
                W.push(b),
                J = h(function() {
                    k(W, function(a) {
                        a()
                    }),
                    W = [],
                    J = null ,
                    U = {}
                })
            }
            function l(a, c) {
                var d = f(a);
                a = b.element(d),
                Z.push(a);
                var e = Date.now() + c;
                Y >= e || (g.cancel(X),
                Y = e,
                X = g(function() {
                    n(Z),
                    Z = []
                }, c, !1))
            }
            function n(a) {
                k(a, function(a) {
                    var b = a.data(P);
                    b && (b.closeAnimationFn || j)()
                })
            }
            function o(a, b) {
                var c = b ? U[b] : null ;
                if (!c) {
                    var e, f, g, h, i = 0, j = 0, l = 0, n = 0;
                    k(a, function(a) {
                        if (a.nodeType == m) {
                            var b = d.getComputedStyle(a) || {};
                            g = b[E + K],
                            i = Math.max(p(g), i),
                            h = b[E + L],
                            e = b[E + M],
                            j = Math.max(p(e), j),
                            f = b[G + M],
                            n = Math.max(p(f), n);
                            var c = p(b[G + K]);
                            c > 0 && (c *= parseInt(b[G + N], 10) || 1),
                            l = Math.max(c, l)
                        }
                    }),
                    c = {
                        total: 0,
                        transitionPropertyStyle: h,
                        transitionDurationStyle: g,
                        transitionDelayStyle: e,
                        transitionDelay: j,
                        transitionDuration: i,
                        animationDelayStyle: f,
                        animationDelay: n,
                        animationDuration: l
                    },
                    b && (U[b] = c)
                }
                return c
            }
            function p(a) {
                var c = 0
                  , d = b.isString(a) ? a.split(/\s*,\s*/) : [];
                return k(d, function(a) {
                    c = Math.max(parseFloat(a) || 0, c)
                }),
                c
            }
            function q(a) {
                var b = a.parent()
                  , c = b.data(O);
                return c || (b.data(O, ++V),
                c = V),
                c + "-" + f(a).getAttribute("class")
            }
            function r(a, b, c, d) {
                var e = q(b)
                  , f = e + " " + c
                  , g = U[f] ? ++U[f].total : 0
                  , h = {};
                if (g > 0) {
                    var i = c + "-stagger"
                      , k = e + " " + i
                      , l = !U[k];
                    l && b.addClass(i),
                    h = o(b, k),
                    l && b.removeClass(i)
                }
                d = d || function(a) {
                    return a()
                }
                ,
                b.addClass(c);
                var m = b.data(P) || {}
                  , n = d(function() {
                    return o(b, f)
                })
                  , p = n.transitionDuration
                  , r = n.animationDuration;
                if (0 === p && 0 === r)
                    return b.removeClass(c),
                    !1;
                b.data(P, {
                    running: m.running || 0,
                    itemIndex: g,
                    stagger: h,
                    timings: n,
                    closeAnimationFn: j
                });
                var s = m.running > 0 || "setClass" == a;
                return p > 0 && t(b, c, s),
                r > 0 && h.animationDelay > 0 && 0 === h.animationDuration && u(b),
                !0
            }
            function s(a) {
                return "ng-enter" == a || "ng-move" == a || "ng-leave" == a
            }
            function t(a, b, c) {
                s(b) || !c ? f(a).style[E + L] = "none" : a.addClass(Q)
            }
            function u(a) {
                f(a).style[G] = "none 0s"
            }
            function v(a) {
                var b = E + L
                  , c = f(a);
                c.style[b] && c.style[b].length > 0 && (c.style[b] = ""),
                a.removeClass(Q)
            }
            function w(a) {
                var b = G
                  , c = f(a);
                c.style[b] && c.style[b].length > 0 && (c.style[b] = "")
            }
            function x(a, b, c, d) {
                function e() {
                    b.off(t, g),
                    b.removeClass(j),
                    C(b, c);
                    var a = f(b);
                    for (var d in v)
                        a.style.removeProperty(v[d])
                }
                function g(a) {
                    a.stopPropagation();
                    var b = a.originalEvent || a
                      , c = b.$manualTimeStamp || b.timeStamp || Date.now()
                      , e = parseFloat(b.elapsedTime.toFixed(R));
                    Math.max(c - s, 0) >= r && e >= p && d()
                }
                var h = f(b)
                  , i = b.data(P);
                if (-1 == h.getAttribute("class").indexOf(c) || !i)
                    return void d();
                var j = "";
                k(c.split(" "), function(a, b) {
                    j += (b > 0 ? " " : "") + a + "-active"
                });
                var m = i.stagger
                  , n = i.timings
                  , o = i.itemIndex
                  , p = Math.max(n.transitionDuration, n.animationDuration)
                  , q = Math.max(n.transitionDelay, n.animationDelay)
                  , r = q * T
                  , s = Date.now()
                  , t = H + " " + F
                  , u = ""
                  , v = [];
                if (n.transitionDuration > 0) {
                    var w = n.transitionPropertyStyle;
                    -1 == w.indexOf("all") && (u += I + "transition-property: " + w + ";",
                    u += I + "transition-duration: " + n.transitionDurationStyle + ";",
                    v.push(I + "transition-property"),
                    v.push(I + "transition-duration"))
                }
                if (o > 0) {
                    if (m.transitionDelay > 0 && 0 === m.transitionDuration) {
                        var x = n.transitionDelayStyle;
                        u += I + "transition-delay: " + y(x, m.transitionDelay, o) + "; ",
                        v.push(I + "transition-delay")
                    }
                    m.animationDelay > 0 && 0 === m.animationDuration && (u += I + "animation-delay: " + y(n.animationDelayStyle, m.animationDelay, o) + "; ",
                    v.push(I + "animation-delay"))
                }
                if (v.length > 0) {
                    var z = h.getAttribute("style") || "";
                    h.setAttribute("style", z + "; " + u)
                }
                b.on(t, g),
                b.addClass(j),
                i.closeAnimationFn = function() {
                    e(),
                    d()
                }
                ;
                var A = o * (Math.max(m.animationDelay, m.transitionDelay) || 0)
                  , B = (q + p) * S
                  , D = (A + B) * T;
                return i.running++,
                l(b, D),
                e
            }
            function y(a, b, c) {
                var d = "";
                return k(a.split(","), function(a, e) {
                    d += (e > 0 ? "," : "") + (c * b + parseInt(a, 10)) + "s"
                }),
                d
            }
            function z(a, b, c, d) {
                return r(a, b, c, d) ? function(a) {
                    a && C(b, c)
                }
                : void 0
            }
            function A(a, b, c, d) {
                return b.data(P) ? x(a, b, c, d) : (C(b, c),
                void d())
            }
            function B(a, b, c, d) {
                var e = z(a, b, c);
                if (!e)
                    return void d();
                var f = e;
                return i(b, function() {
                    v(b, c),
                    w(b),
                    f = A(a, b, c, d)
                }),
                function(a) {
                    (f || j)(a)
                }
            }
            function C(a, b) {
                a.removeClass(b);
                var c = a.data(P);
                c && (c.running && c.running--,
                c.running && 0 !== c.running || a.removeData(P))
            }
            function D(a, c) {
                var d = "";
                return a = b.isArray(a) ? a : a.split(/\s+/),
                k(a, function(a, b) {
                    a && a.length > 0 && (d += (b > 0 ? " " : "") + a + c)
                }),
                d
            }
            var E, F, G, H, I = "";
            a.ontransitionend === c && a.onwebkittransitionend !== c ? (I = "-webkit-",
            E = "WebkitTransition",
            F = "webkitTransitionEnd transitionend") : (E = "transition",
            F = "transitionend"),
            a.onanimationend === c && a.onwebkitanimationend !== c ? (I = "-webkit-",
            G = "WebkitAnimation",
            H = "webkitAnimationEnd animationend") : (G = "animation",
            H = "animationend");
            var J, K = "Duration", L = "Property", M = "Delay", N = "IterationCount", O = "$$ngAnimateKey", P = "$$ngAnimateCSS3Data", Q = "ng-animate-block-transitions", R = 3, S = 1.5, T = 1e3, U = {}, V = 0, W = [], X = null , Y = 0, Z = [];
            return {
                enter: function(a, b) {
                    return B("enter", a, "ng-enter", b)
                },
                leave: function(a, b) {
                    return B("leave", a, "ng-leave", b)
                },
                move: function(a, b) {
                    return B("move", a, "ng-move", b)
                },
                beforeSetClass: function(a, b, c, d) {
                    var e = D(c, "-remove") + " " + D(b, "-add")
                      , f = z("setClass", a, e, function(d) {
                        var e = a.attr("class");
                        a.removeClass(c),
                        a.addClass(b);
                        var f = d();
                        return a.attr("class", e),
                        f
                    });
                    return f ? (i(a, function() {
                        v(a, e),
                        w(a),
                        d()
                    }),
                    f) : void d()
                },
                beforeAddClass: function(a, b, c) {
                    var d = z("addClass", a, D(b, "-add"), function(c) {
                        a.addClass(b);
                        var d = c();
                        return a.removeClass(b),
                        d
                    });
                    return d ? (i(a, function() {
                        v(a, b),
                        w(a),
                        c()
                    }),
                    d) : void c()
                },
                setClass: function(a, b, c, d) {
                    c = D(c, "-remove"),
                    b = D(b, "-add");
                    var e = c + " " + b;
                    return A("setClass", a, e, d)
                },
                addClass: function(a, b, c) {
                    return A("addClass", a, D(b, "-add"), c)
                },
                beforeRemoveClass: function(a, b, c) {
                    var d = z("removeClass", a, D(b, "-remove"), function(c) {
                        var d = a.attr("class");
                        a.removeClass(b);
                        var e = c();
                        return a.attr("class", d),
                        e
                    });
                    return d ? (i(a, function() {
                        v(a, b),
                        w(a),
                        c()
                    }),
                    d) : void c()
                },
                removeClass: function(a, b, c) {
                    return A("removeClass", a, D(b, "-remove"), c)
                }
            }
        }
        ])
    }
    ])
}(window, window.angular),
function(a, b) {
    "use strict";
    function c(a, b, c) {
        d.directive(a, ["$parse", "$swipe", function(d, e) {
            var f = 75
              , g = .3
              , h = 30;
            return function(i, j, k) {
                function l(a) {
                    if (!m)
                        return !1;
                    var c = Math.abs(a.y - m.y)
                      , d = (a.x - m.x) * b;
                    return n && f > c && d > 0 && d > h && g > c / d
                }
                var m, n, o = d(k[a]);
                e.bind(j, {
                    start: function(a) {
                        m = a,
                        n = !0
                    },
                    cancel: function() {
                        n = !1
                    },
                    end: function(a, b) {
                        l(a) && i.$apply(function() {
                            j.triggerHandler(c),
                            o(i, {
                                $event: b
                            })
                        })
                    }
                })
            }
        }
        ])
    }
    var d = b.module("ngTouch", []);
    d.factory("$swipe", [function() {
        function a(a) {
            var b = a.touches && a.touches.length ? a.touches : [a]
              , c = a.changedTouches && a.changedTouches[0] || a.originalEvent && a.originalEvent.changedTouches && a.originalEvent.changedTouches[0] || b[0].originalEvent || b[0];
            return {
                x: c.clientX,
                y: c.clientY
            }
        }
        var b = 10;
        return {
            bind: function(c, d) {
                var e, f, g, h, i = !1;
                c.on("touchstart mousedown", function(b) {
                    g = a(b),
                    i = !0,
                    e = 0,
                    f = 0,
                    h = g,
                    d.start && d.start(g, b)
                }),
                c.on("touchcancel", function(a) {
                    i = !1,
                    d.cancel && d.cancel(a)
                }),
                c.on("touchmove mousemove", function(c) {
                    if (i && g) {
                        var j = a(c);
                        if (e += Math.abs(j.x - h.x),
                        f += Math.abs(j.y - h.y),
                        h = j,
                        !(b > e && b > f))
                            return f > e ? (i = !1,
                            void (d.cancel && d.cancel(c))) : (c.preventDefault(),
                            void (d.move && d.move(j, c)))
                    }
                }),
                c.on("touchend mouseup", function(b) {
                    i && (i = !1,
                    d.end && d.end(a(b), b))
                })
            }
        }
    }
    ]),
    d.config(["$provide", function(a) {
        a.decorator("ngClickDirective", ["$delegate", function(a) {
            return a.shift(),
            a
        }
        ])
    }
    ]),
    d.directive("ngClick", ["$parse", "$timeout", "$rootElement", function(a, c, d) {
        function e(a, b, c, d) {
            return Math.abs(a - c) < p && Math.abs(b - d) < p
        }
        function f(a, b, c) {
            for (var d = 0; d < a.length; d += 2)
                if (e(a[d], a[d + 1], b, c))
                    return a.splice(d, d + 2),
                    !0;
            return !1
        }
        function g(a) {
            if (!(Date.now() - j > o)) {
                var b = a.touches && a.touches.length ? a.touches : [a]
                  , c = b[0].clientX
                  , d = b[0].clientY;
                1 > c && 1 > d || l && l[0] === c && l[1] === d || (l && (l = null ),
                "label" === a.target.tagName.toLowerCase() && (l = [c, d]),
                f(k, c, d) || (a.stopPropagation(),
                a.preventDefault(),
                a.target && a.target.blur()))
            }
        }
        function h(a) {
            var b = a.touches && a.touches.length ? a.touches : [a]
              , d = b[0].clientX
              , e = b[0].clientY;
            k.push(d, e),
            c(function() {
                for (var a = 0; a < k.length; a += 2)
                    if (k[a] == d && k[a + 1] == e)
                        return void k.splice(a, a + 2)
            }, o, !1)
        }
        function i(a, b) {
            k || (d[0].addEventListener("click", g, !0),
            d[0].addEventListener("touchstart", h, !0),
            k = []),
            j = Date.now(),
            f(k, a, b)
        }
        var j, k, l, m = 750, n = 12, o = 2500, p = 25, q = "ng-click-active";
        return function(c, d, e) {
            function f() {
                o = !1,
                d.removeClass(q)
            }
            var g, h, j, k, l = a(e.ngClick), o = !1;
            d.on("touchstart", function(a) {
                o = !0,
                g = a.target ? a.target : a.srcElement,
                3 == g.nodeType && (g = g.parentNode),
                d.addClass(q),
                h = Date.now();
                var b = a.touches && a.touches.length ? a.touches : [a]
                  , c = b[0].originalEvent || b[0];
                j = c.clientX,
                k = c.clientY
            }),
            d.on("touchmove", function() {
                f()
            }),
            d.on("touchcancel", function() {
                f()
            }),
            d.on("touchend", function(a) {
                var c = Date.now() - h
                  , l = a.changedTouches && a.changedTouches.length ? a.changedTouches : a.touches && a.touches.length ? a.touches : [a]
                  , p = l[0].originalEvent || l[0]
                  , q = p.clientX
                  , r = p.clientY
                  , s = Math.sqrt(Math.pow(q - j, 2) + Math.pow(r - k, 2));
                o && m > c && n > s && (i(q, r),
                g && g.blur(),
                b.isDefined(e.disabled) && e.disabled !== !1 || d.triggerHandler("click", [a])),
                f()
            }),
            d.onclick = function() {}
            ,
            d.on("click", function(a, b) {
                c.$apply(function() {
                    l(c, {
                        $event: b || a
                    })
                })
            }),
            d.on("mousedown", function() {
                d.addClass(q)
            }),
            d.on("mousemove mouseup", function() {
                d.removeClass(q)
            })
        }
    }
    ]),
    c("ngSwipeLeft", -1, "swipeleft"),
    c("ngSwipeRight", 1, "swiperight")
}(window, window.angular),
function() {
    "use strict";
    var a = angular.module("LocalStorageModule", []);
    a.provider("localStorageService", function() {
        this.prefix = "ls",
        this.storageType = "localStorage",
        this.cookie = {
            expiry: 30,
            path: "/"
        },
        this.notify = {
            setItem: !0,
            removeItem: !1
        },
        this.setPrefix = function(a) {
            this.prefix = a
        }
        ,
        this.setStorageType = function(a) {
            this.storageType = a
        }
        ,
        this.setStorageCookie = function(a, b) {
            this.cookie = {
                expiry: a,
                path: b
            }
        }
        ,
        this.setStorageCookieDomain = function(a) {
            this.cookie.domain = a
        }
        ,
        this.setNotify = function(a, b) {
            this.notify = {
                setItem: a,
                removeItem: b
            }
        }
        ,
        this.$get = ["$rootScope", "$window", "$document", function(a, b, c) {
            var d = this.prefix
              , e = this.cookie
              , f = this.notify
              , g = this.storageType
              , h = b[g];
            c || (c = document),
            "." !== d.substr(-1) && (d = d ? d + "." : "");
            var i = function() {
                try {
                    var c = g in b && null !== b[g]
                      , e = d + "__" + Math.round(1e7 * Math.random());
                    return c && (h.setItem(e, ""),
                    h.removeItem(e)),
                    !0
                } catch (f) {
                    return g = "cookie",
                    a.$broadcast("LocalStorageModule.notification.error", f.message),
                    !1
                }
            }()
              , j = function(b, c) {
                if (!i)
                    return a.$broadcast("LocalStorageModule.notification.warning", "LOCAL_STORAGE_NOT_SUPPORTED"),
                    f.setItem && a.$broadcast("LocalStorageModule.notification.setitem", {
                        key: b,
                        newvalue: c,
                        storageType: "cookie"
                    }),
                    p(b, c);
                "undefined" == typeof c && (c = null );
                try {
                    (angular.isObject(c) || angular.isArray(c)) && (c = angular.toJson(c)),
                    h.setItem(d + b, c),
                    f.setItem && a.$broadcast("LocalStorageModule.notification.setitem", {
                        key: b,
                        newvalue: c,
                        storageType: this.storageType
                    })
                } catch (e) {
                    return a.$broadcast("LocalStorageModule.notification.error", e.message),
                    p(b, c)
                }
                return !0
            }
              , k = function(b) {
                if (!i)
                    return a.$broadcast("LocalStorageModule.notification.warning", "LOCAL_STORAGE_NOT_SUPPORTED"),
                    q(b);
                var c = h.getItem(d + b);
                return c && "null" !== c ? "{" === c.charAt(0) || "[" === c.charAt(0) ? angular.fromJson(c) : c : null
            }
              , l = function(b) {
                if (!i)
                    return a.$broadcast("LocalStorageModule.notification.warning", "LOCAL_STORAGE_NOT_SUPPORTED"),
                    f.removeItem && a.$broadcast("LocalStorageModule.notification.removeitem", {
                        key: b,
                        storageType: "cookie"
                    }),
                    r(b);
                try {
                    h.removeItem(d + b),
                    f.removeItem && a.$broadcast("LocalStorageModule.notification.removeitem", {
                        key: b,
                        storageType: this.storageType
                    })
                } catch (c) {
                    return a.$broadcast("LocalStorageModule.notification.error", c.message),
                    r(b)
                }
                return !0
            }
              , m = function() {
                if (!i)
                    return a.$broadcast("LocalStorageModule.notification.warning", "LOCAL_STORAGE_NOT_SUPPORTED"),
                    !1;
                var b = d.length
                  , c = [];
                for (var e in h)
                    if (e.substr(0, b) === d)
                        try {
                            c.push(e.substr(b))
                        } catch (f) {
                            return a.$broadcast("LocalStorageModule.notification.error", f.Description),
                            []
                        }
                return c
            }
              , n = function(b) {
                var b = b || ""
                  , c = d.slice(0, -1) + "."
                  , e = RegExp(c + b);
                if (!i)
                    return a.$broadcast("LocalStorageModule.notification.warning", "LOCAL_STORAGE_NOT_SUPPORTED"),
                    s();
                var f = d.length;
                for (var g in h)
                    if (e.test(g))
                        try {
                            l(g.substr(f))
                        } catch (j) {
                            return a.$broadcast("LocalStorageModule.notification.error", j.message),
                            s()
                        }
                return !0
            }
              , o = function() {
                try {
                    return navigator.cookieEnabled || "cookie"in c && (c.cookie.length > 0 || (c.cookie = "test").indexOf.call(c.cookie, "test") > -1)
                } catch (b) {
                    return a.$broadcast("LocalStorageModule.notification.error", b.message),
                    !1
                }
            }
              , p = function(b, f) {
                if ("undefined" == typeof f)
                    return !1;
                if (!o())
                    return a.$broadcast("LocalStorageModule.notification.error", "COOKIES_NOT_SUPPORTED"),
                    !1;
                try {
                    var g = ""
                      , h = new Date
                      , i = "";
                    if (null === f ? (h.setTime(h.getTime() + -864e5),
                    g = "; expires=" + h.toGMTString(),
                    f = "") : 0 !== e.expiry && (h.setTime(h.getTime() + 24 * e.expiry * 60 * 60 * 1e3),
                    g = "; expires=" + h.toGMTString()),
                    b) {
                        var j = "; path=" + e.path;
                        e.domain && (i = "; domain=" + e.domain),
                        c.cookie = d + b + "=" + encodeURIComponent(f) + g + j + i
                    }
                } catch (k) {
                    return a.$broadcast("LocalStorageModule.notification.error", k.message),
                    !1
                }
                return !0
            }
              , q = function(b) {
                if (!o())
                    return a.$broadcast("LocalStorageModule.notification.error", "COOKIES_NOT_SUPPORTED"),
                    !1;
                for (var e = c.cookie && c.cookie.split(";") || [], f = 0; f < e.length; f++) {
                    for (var g = e[f]; " " === g.charAt(0); )
                        g = g.substring(1, g.length);
                    if (0 === g.indexOf(d + b + "="))
                        return decodeURIComponent(g.substring(d.length + b.length + 1, g.length))
                }
                return null
            }
              , r = function(a) {
                p(a, null )
            }
              , s = function() {
                for (var a = null , b = d.length, e = c.cookie.split(";"), f = 0; f < e.length; f++) {
                    for (a = e[f]; " " === a.charAt(0); )
                        a = a.substring(1, a.length);
                    var g = a.substring(b, a.indexOf("="));
                    r(g)
                }
            }
              , t = function() {
                return g
            }
            ;
            return {
                isSupported: i,
                getStorageType: t,
                set: j,
                add: j,
                get: k,
                keys: m,
                remove: l,
                clearAll: n,
                cookie: {
                    set: p,
                    add: p,
                    get: q,
                    remove: r,
                    clearAll: s
                }
            }
        }
        ]
    })
}
.call(this),
function() {
    var a = this
      , b = a._
      , c = {}
      , d = Array.prototype
      , e = Object.prototype
      , f = Function.prototype
      , g = d.push
      , h = d.slice
      , i = d.concat
      , j = e.toString
      , k = e.hasOwnProperty
      , l = d.forEach
      , m = d.map
      , n = d.reduce
      , o = d.reduceRight
      , p = d.filter
      , q = d.every
      , r = d.some
      , s = d.indexOf
      , t = d.lastIndexOf
      , u = Array.isArray
      , v = Object.keys
      , w = f.bind
      , x = function(a) {
        return a instanceof x ? a : this instanceof x ? void (this._wrapped = a) : new x(a)
    }
    ;
    "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = x),
    exports._ = x) : a._ = x,
    x.VERSION = "1.5.2";
    var y = x.each = x.forEach = function(a, b, d) {
        if (null != a)
            if (l && a.forEach === l)
                a.forEach(b, d);
            else if (a.length === +a.length) {
                for (var e = 0, f = a.length; f > e; e++)
                    if (b.call(d, a[e], e, a) === c)
                        return
            } else
                for (var g = x.keys(a), e = 0, f = g.length; f > e; e++)
                    if (b.call(d, a[g[e]], g[e], a) === c)
                        return
    }
    ;
    x.map = x.collect = function(a, b, c) {
        var d = [];
        return null == a ? d : m && a.map === m ? a.map(b, c) : (y(a, function(a, e, f) {
            d.push(b.call(c, a, e, f))
        }),
        d)
    }
    ;
    var z = "Reduce of empty array with no initial value";
    x.reduce = x.foldl = x.inject = function(a, b, c, d) {
        var e = arguments.length > 2;
        if (null == a && (a = []),
        n && a.reduce === n)
            return d && (b = x.bind(b, d)),
            e ? a.reduce(b, c) : a.reduce(b);
        if (y(a, function(a, f, g) {
            e ? c = b.call(d, c, a, f, g) : (c = a,
            e = !0)
        }),
        !e)
            throw new TypeError(z);
        return c
    }
    ,
    x.reduceRight = x.foldr = function(a, b, c, d) {
        var e = arguments.length > 2;
        if (null == a && (a = []),
        o && a.reduceRight === o)
            return d && (b = x.bind(b, d)),
            e ? a.reduceRight(b, c) : a.reduceRight(b);
        var f = a.length;
        if (f !== +f) {
            var g = x.keys(a);
            f = g.length
        }
        if (y(a, function(h, i, j) {
            i = g ? g[--f] : --f,
            e ? c = b.call(d, c, a[i], i, j) : (c = a[i],
            e = !0)
        }),
        !e)
            throw new TypeError(z);
        return c
    }
    ,
    x.find = x.detect = function(a, b, c) {
        var d;
        return A(a, function(a, e, f) {
            return b.call(c, a, e, f) ? (d = a,
            !0) : void 0
        }),
        d
    }
    ,
    x.filter = x.select = function(a, b, c) {
        var d = [];
        return null == a ? d : p && a.filter === p ? a.filter(b, c) : (y(a, function(a, e, f) {
            b.call(c, a, e, f) && d.push(a)
        }),
        d)
    }
    ,
    x.reject = function(a, b, c) {
        return x.filter(a, function(a, d, e) {
            return !b.call(c, a, d, e)
        }, c)
    }
    ,
    x.every = x.all = function(a, b, d) {
        b || (b = x.identity);
        var e = !0;
        return null == a ? e : q && a.every === q ? a.every(b, d) : (y(a, function(a, f, g) {
            return (e = e && b.call(d, a, f, g)) ? void 0 : c
        }),
        !!e)
    }
    ;
    var A = x.some = x.any = function(a, b, d) {
        b || (b = x.identity);
        var e = !1;
        return null == a ? e : r && a.some === r ? a.some(b, d) : (y(a, function(a, f, g) {
            return e || (e = b.call(d, a, f, g)) ? c : void 0
        }),
        !!e)
    }
    ;
    x.contains = x.include = function(a, b) {
        return null == a ? !1 : s && a.indexOf === s ? -1 != a.indexOf(b) : A(a, function(a) {
            return a === b
        })
    }
    ,
    x.invoke = function(a, b) {
        var c = h.call(arguments, 2)
          , d = x.isFunction(b);
        return x.map(a, function(a) {
            return (d ? b : a[b]).apply(a, c)
        })
    }
    ,
    x.pluck = function(a, b) {
        return x.map(a, function(a) {
            return a[b]
        })
    }
    ,
    x.where = function(a, b, c) {
        return x.isEmpty(b) ? c ? void 0 : [] : x[c ? "find" : "filter"](a, function(a) {
            for (var c in b)
                if (b[c] !== a[c])
                    return !1;
            return !0
        })
    }
    ,
    x.findWhere = function(a, b) {
        return x.where(a, b, !0)
    }
    ,
    x.max = function(a, b, c) {
        if (!b && x.isArray(a) && a[0] === +a[0] && a.length < 65535)
            return Math.max.apply(Math, a);
        if (!b && x.isEmpty(a))
            return -1 / 0;
        var d = {
            computed: -1 / 0,
            value: -1 / 0
        };
        return y(a, function(a, e, f) {
            var g = b ? b.call(c, a, e, f) : a;
            g > d.computed && (d = {
                value: a,
                computed: g
            })
        }),
        d.value
    }
    ,
    x.min = function(a, b, c) {
        if (!b && x.isArray(a) && a[0] === +a[0] && a.length < 65535)
            return Math.min.apply(Math, a);
        if (!b && x.isEmpty(a))
            return 1 / 0;
        var d = {
            computed: 1 / 0,
            value: 1 / 0
        };
        return y(a, function(a, e, f) {
            var g = b ? b.call(c, a, e, f) : a;
            g < d.computed && (d = {
                value: a,
                computed: g
            })
        }),
        d.value
    }
    ,
    x.shuffle = function(a) {
        var b, c = 0, d = [];
        return y(a, function(a) {
            b = x.random(c++),
            d[c - 1] = d[b],
            d[b] = a
        }),
        d
    }
    ,
    x.sample = function(a, b, c) {
        return arguments.length < 2 || c ? a[x.random(a.length - 1)] : x.shuffle(a).slice(0, Math.max(0, b))
    }
    ;
    var B = function(a) {
        return x.isFunction(a) ? a : function(b) {
            return b[a]
        }
    }
    ;
    x.sortBy = function(a, b, c) {
        var d = B(b);
        return x.pluck(x.map(a, function(a, b, e) {
            return {
                value: a,
                index: b,
                criteria: d.call(c, a, b, e)
            }
        }).sort(function(a, b) {
            var c = a.criteria
              , d = b.criteria;
            if (c !== d) {
                if (c > d || void 0 === c)
                    return 1;
                if (d > c || void 0 === d)
                    return -1
            }
            return a.index - b.index
        }), "value")
    }
    ;
    var C = function(a) {
        return function(b, c, d) {
            var e = {}
              , f = null == c ? x.identity : B(c);
            return y(b, function(c, g) {
                var h = f.call(d, c, g, b);
                a(e, h, c)
            }),
            e
        }
    }
    ;
    x.groupBy = C(function(a, b, c) {
        (x.has(a, b) ? a[b] : a[b] = []).push(c)
    }),
    x.indexBy = C(function(a, b, c) {
        a[b] = c
    }),
    x.countBy = C(function(a, b) {
        x.has(a, b) ? a[b]++ : a[b] = 1
    }),
    x.sortedIndex = function(a, b, c, d) {
        c = null == c ? x.identity : B(c);
        for (var e = c.call(d, b), f = 0, g = a.length; g > f; ) {
            var h = f + g >>> 1;
            c.call(d, a[h]) < e ? f = h + 1 : g = h
        }
        return f
    }
    ,
    x.toArray = function(a) {
        return a ? x.isArray(a) ? h.call(a) : a.length === +a.length ? x.map(a, x.identity) : x.values(a) : []
    }
    ,
    x.size = function(a) {
        return null == a ? 0 : a.length === +a.length ? a.length : x.keys(a).length
    }
    ,
    x.first = x.head = x.take = function(a, b, c) {
        return null == a ? void 0 : null == b || c ? a[0] : h.call(a, 0, b)
    }
    ,
    x.initial = function(a, b, c) {
        return h.call(a, 0, a.length - (null == b || c ? 1 : b))
    }
    ,
    x.last = function(a, b, c) {
        return null == a ? void 0 : null == b || c ? a[a.length - 1] : h.call(a, Math.max(a.length - b, 0))
    }
    ,
    x.rest = x.tail = x.drop = function(a, b, c) {
        return h.call(a, null == b || c ? 1 : b)
    }
    ,
    x.compact = function(a) {
        return x.filter(a, x.identity)
    }
    ;
    var D = function(a, b, c) {
        return b && x.every(a, x.isArray) ? i.apply(c, a) : (y(a, function(a) {
            x.isArray(a) || x.isArguments(a) ? b ? g.apply(c, a) : D(a, b, c) : c.push(a)
        }),
        c)
    }
    ;
    x.flatten = function(a, b) {
        return D(a, b, [])
    }
    ,
    x.without = function(a) {
        return x.difference(a, h.call(arguments, 1))
    }
    ,
    x.uniq = x.unique = function(a, b, c, d) {
        x.isFunction(b) && (d = c,
        c = b,
        b = !1);
        var e = c ? x.map(a, c, d) : a
          , f = []
          , g = [];
        return y(e, function(c, d) {
            (b ? d && g[g.length - 1] === c : x.contains(g, c)) || (g.push(c),
            f.push(a[d]))
        }),
        f
    }
    ,
    x.union = function() {
        return x.uniq(x.flatten(arguments, !0))
    }
    ,
    x.intersection = function(a) {
        var b = h.call(arguments, 1);
        return x.filter(x.uniq(a), function(a) {
            return x.every(b, function(b) {
                return x.indexOf(b, a) >= 0
            })
        })
    }
    ,
    x.difference = function(a) {
        var b = i.apply(d, h.call(arguments, 1));
        return x.filter(a, function(a) {
            return !x.contains(b, a)
        })
    }
    ,
    x.zip = function() {
        for (var a = x.max(x.pluck(arguments, "length").concat(0)), b = new Array(a), c = 0; a > c; c++)
            b[c] = x.pluck(arguments, "" + c);
        return b
    }
    ,
    x.object = function(a, b) {
        if (null == a)
            return {};
        for (var c = {}, d = 0, e = a.length; e > d; d++)
            b ? c[a[d]] = b[d] : c[a[d][0]] = a[d][1];
        return c
    }
    ,
    x.indexOf = function(a, b, c) {
        if (null == a)
            return -1;
        var d = 0
          , e = a.length;
        if (c) {
            if ("number" != typeof c)
                return d = x.sortedIndex(a, b),
                a[d] === b ? d : -1;
            d = 0 > c ? Math.max(0, e + c) : c
        }
        if (s && a.indexOf === s)
            return a.indexOf(b, c);
        for (; e > d; d++)
            if (a[d] === b)
                return d;
        return -1
    }
    ,
    x.lastIndexOf = function(a, b, c) {
        if (null == a)
            return -1;
        var d = null != c;
        if (t && a.lastIndexOf === t)
            return d ? a.lastIndexOf(b, c) : a.lastIndexOf(b);
        for (var e = d ? c : a.length; e--; )
            if (a[e] === b)
                return e;
        return -1
    }
    ,
    x.range = function(a, b, c) {
        arguments.length <= 1 && (b = a || 0,
        a = 0),
        c = arguments[2] || 1;
        for (var d = Math.max(Math.ceil((b - a) / c), 0), e = 0, f = new Array(d); d > e; )
            f[e++] = a,
            a += c;
        return f
    }
    ;
    var E = function() {}
    ;
    x.bind = function(a, b) {
        var c, d;
        if (w && a.bind === w)
            return w.apply(a, h.call(arguments, 1));
        if (!x.isFunction(a))
            throw new TypeError;
        return c = h.call(arguments, 2),
        d = function() {
            if (!(this instanceof d))
                return a.apply(b, c.concat(h.call(arguments)));
            E.prototype = a.prototype;
            var e = new E;
            E.prototype = null ;
            var f = a.apply(e, c.concat(h.call(arguments)));
            return Object(f) === f ? f : e
        }
    }
    ,
    x.partial = function(a) {
        var b = h.call(arguments, 1);
        return function() {
            return a.apply(this, b.concat(h.call(arguments)))
        }
    }
    ,
    x.bindAll = function(a) {
        var b = h.call(arguments, 1);
        if (0 === b.length)
            throw new Error("bindAll must be passed function names");
        return y(b, function(b) {
            a[b] = x.bind(a[b], a)
        }),
        a
    }
    ,
    x.memoize = function(a, b) {
        var c = {};
        return b || (b = x.identity),
        function() {
            var d = b.apply(this, arguments);
            return x.has(c, d) ? c[d] : c[d] = a.apply(this, arguments)
        }
    }
    ,
    x.delay = function(a, b) {
        var c = h.call(arguments, 2);
        return setTimeout(function() {
            return a.apply(null , c)
        }, b)
    }
    ,
    x.defer = function(a) {
        return x.delay.apply(x, [a, 1].concat(h.call(arguments, 1)))
    }
    ,
    x.throttle = function(a, b, c) {
        var d, e, f, g = null , h = 0;
        c || (c = {});
        var i = function() {
            h = c.leading === !1 ? 0 : new Date,
            g = null ,
            f = a.apply(d, e)
        }
        ;
        return function() {
            var j = new Date;
            h || c.leading !== !1 || (h = j);
            var k = b - (j - h);
            return d = this,
            e = arguments,
            0 >= k ? (clearTimeout(g),
            g = null ,
            h = j,
            f = a.apply(d, e)) : g || c.trailing === !1 || (g = setTimeout(i, k)),
            f
        }
    }
    ,
    x.debounce = function(a, b, c) {
        var d, e, f, g, h;
        return function() {
            f = this,
            e = arguments,
            g = new Date;
            var i = function() {
                var j = new Date - g;
                b > j ? d = setTimeout(i, b - j) : (d = null ,
                c || (h = a.apply(f, e)))
            }
              , j = c && !d;
            return d || (d = setTimeout(i, b)),
            j && (h = a.apply(f, e)),
            h
        }
    }
    ,
    x.once = function(a) {
        var b, c = !1;
        return function() {
            return c ? b : (c = !0,
            b = a.apply(this, arguments),
            a = null ,
            b)
        }
    }
    ,
    x.wrap = function(a, b) {
        return function() {
            var c = [a];
            return g.apply(c, arguments),
            b.apply(this, c)
        }
    }
    ,
    x.compose = function() {
        var a = arguments;
        return function() {
            for (var b = arguments, c = a.length - 1; c >= 0; c--)
                b = [a[c].apply(this, b)];
            return b[0]
        }
    }
    ,
    x.after = function(a, b) {
        return function() {
            return --a < 1 ? b.apply(this, arguments) : void 0
        }
    }
    ,
    x.keys = v || function(a) {
        if (a !== Object(a))
            throw new TypeError("Invalid object");
        var b = [];
        for (var c in a)
            x.has(a, c) && b.push(c);
        return b
    }
    ,
    x.values = function(a) {
        for (var b = x.keys(a), c = b.length, d = new Array(c), e = 0; c > e; e++)
            d[e] = a[b[e]];
        return d
    }
    ,
    x.pairs = function(a) {
        for (var b = x.keys(a), c = b.length, d = new Array(c), e = 0; c > e; e++)
            d[e] = [b[e], a[b[e]]];
        return d
    }
    ,
    x.invert = function(a) {
        for (var b = {}, c = x.keys(a), d = 0, e = c.length; e > d; d++)
            b[a[c[d]]] = c[d];
        return b
    }
    ,
    x.functions = x.methods = function(a) {
        var b = [];
        for (var c in a)
            x.isFunction(a[c]) && b.push(c);
        return b.sort()
    }
    ,
    x.extend = function(a) {
        return y(h.call(arguments, 1), function(b) {
            if (b)
                for (var c in b)
                    a[c] = b[c]
        }),
        a
    }
    ,
    x.pick = function(a) {
        var b = {}
          , c = i.apply(d, h.call(arguments, 1));
        return y(c, function(c) {
            c in a && (b[c] = a[c])
        }),
        b
    }
    ,
    x.omit = function(a) {
        var b = {}
          , c = i.apply(d, h.call(arguments, 1));
        for (var e in a)
            x.contains(c, e) || (b[e] = a[e]);
        return b
    }
    ,
    x.defaults = function(a) {
        return y(h.call(arguments, 1), function(b) {
            if (b)
                for (var c in b)
                    void 0 === a[c] && (a[c] = b[c])
        }),
        a
    }
    ,
    x.clone = function(a) {
        return x.isObject(a) ? x.isArray(a) ? a.slice() : x.extend({}, a) : a
    }
    ,
    x.tap = function(a, b) {
        return b(a),
        a
    }
    ;
    var F = function(a, b, c, d) {
        if (a === b)
            return 0 !== a || 1 / a == 1 / b;
        if (null == a || null == b)
            return a === b;
        a instanceof x && (a = a._wrapped),
        b instanceof x && (b = b._wrapped);
        var e = j.call(a);
        if (e != j.call(b))
            return !1;
        switch (e) {
        case "[object String]":
            return a == String(b);
        case "[object Number]":
            return a != +a ? b != +b : 0 == a ? 1 / a == 1 / b : a == +b;
        case "[object Date]":
        case "[object Boolean]":
            return +a == +b;
        case "[object RegExp]":
            return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase
        }
        if ("object" != typeof a || "object" != typeof b)
            return !1;
        for (var f = c.length; f--; )
            if (c[f] == a)
                return d[f] == b;
        var g = a.constructor
          , h = b.constructor;
        if (g !== h && !(x.isFunction(g) && g instanceof g && x.isFunction(h) && h instanceof h))
            return !1;
        c.push(a),
        d.push(b);
        var i = 0
          , k = !0;
        if ("[object Array]" == e) {
            if (i = a.length,
            k = i == b.length)
                for (; i-- && (k = F(a[i], b[i], c, d)); )
                    ;
        } else {
            for (var l in a)
                if (x.has(a, l) && (i++,
                !(k = x.has(b, l) && F(a[l], b[l], c, d))))
                    break;
            if (k) {
                for (l in b)
                    if (x.has(b, l) && !i--)
                        break;
                k = !i
            }
        }
        return c.pop(),
        d.pop(),
        k
    }
    ;
    x.isEqual = function(a, b) {
        return F(a, b, [], [])
    }
    ,
    x.isEmpty = function(a) {
        if (null == a)
            return !0;
        if (x.isArray(a) || x.isString(a))
            return 0 === a.length;
        for (var b in a)
            if (x.has(a, b))
                return !1;
        return !0
    }
    ,
    x.isElement = function(a) {
        return !(!a || 1 !== a.nodeType)
    }
    ,
    x.isArray = u || function(a) {
        return "[object Array]" == j.call(a)
    }
    ,
    x.isObject = function(a) {
        return a === Object(a)
    }
    ,
    y(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function(a) {
        x["is" + a] = function(b) {
            return j.call(b) == "[object " + a + "]"
        }
    }),
    x.isArguments(arguments) || (x.isArguments = function(a) {
        return !(!a || !x.has(a, "callee"))
    }
    ),
    "function" != typeof /./ && (x.isFunction = function(a) {
        return "function" == typeof a
    }
    ),
    x.isFinite = function(a) {
        return isFinite(a) && !isNaN(parseFloat(a))
    }
    ,
    x.isNaN = function(a) {
        return x.isNumber(a) && a != +a
    }
    ,
    x.isBoolean = function(a) {
        return a === !0 || a === !1 || "[object Boolean]" == j.call(a)
    }
    ,
    x.isNull = function(a) {
        return null === a
    }
    ,
    x.isUndefined = function(a) {
        return void 0 === a
    }
    ,
    x.has = function(a, b) {
        return k.call(a, b)
    }
    ,
    x.noConflict = function() {
        return a._ = b,
        this
    }
    ,
    x.identity = function(a) {
        return a
    }
    ,
    x.times = function(a, b, c) {
        for (var d = Array(Math.max(0, a)), e = 0; a > e; e++)
            d[e] = b.call(c, e);
        return d
    }
    ,
    x.random = function(a, b) {
        return null == b && (b = a,
        a = 0),
        a + Math.floor(Math.random() * (b - a + 1))
    }
    ;
    var G = {
        escape: {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;"
        }
    };
    G.unescape = x.invert(G.escape);
    var H = {
        escape: new RegExp("[" + x.keys(G.escape).join("") + "]","g"),
        unescape: new RegExp("(" + x.keys(G.unescape).join("|") + ")","g")
    };
    x.each(["escape", "unescape"], function(a) {
        x[a] = function(b) {
            return null == b ? "" : ("" + b).replace(H[a], function(b) {
                return G[a][b]
            })
        }
    }),
    x.result = function(a, b) {
        if (null == a)
            return void 0;
        var c = a[b];
        return x.isFunction(c) ? c.call(a) : c
    }
    ,
    x.mixin = function(a) {
        y(x.functions(a), function(b) {
            var c = x[b] = a[b];
            x.prototype[b] = function() {
                var a = [this._wrapped];
                return g.apply(a, arguments),
                M.call(this, c.apply(x, a))
            }
        })
    }
    ;
    var I = 0;
    x.uniqueId = function(a) {
        var b = ++I + "";
        return a ? a + b : b
    }
    ,
    x.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    var J = /(.)^/
      , K = {
        "'": "'",
        "\\": "\\",
        "\r": "r",
        "\n": "n",
        "	": "t",
        "\u2028": "u2028",
        "\u2029": "u2029"
    }
      , L = /\\|'|\r|\n|\t|\u2028|\u2029/g;
    x.template = function(a, b, c) {
        var d;
        c = x.defaults({}, c, x.templateSettings);
        var e = new RegExp([(c.escape || J).source, (c.interpolate || J).source, (c.evaluate || J).source].join("|") + "|$","g")
          , f = 0
          , g = "__p+='";
        a.replace(e, function(b, c, d, e, h) {
            return g += a.slice(f, h).replace(L, function(a) {
                return "\\" + K[a]
            }),
            c && (g += "'+\n((__t=(" + c + "))==null?'':_.escape(__t))+\n'"),
            d && (g += "'+\n((__t=(" + d + "))==null?'':__t)+\n'"),
            e && (g += "';\n" + e + "\n__p+='"),
            f = h + b.length,
            b
        }),
        g += "';\n",
        c.variable || (g = "with(obj||{}){\n" + g + "}\n"),
        g = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + g + "return __p;\n";
        try {
            d = new Function(c.variable || "obj","_",g)
        } catch (h) {
            throw h.source = g,
            h
        }
        if (b)
            return d(b, x);
        var i = function(a) {
            return d.call(this, a, x)
        }
        ;
        return i.source = "function(" + (c.variable || "obj") + "){\n" + g + "}",
        i
    }
    ,
    x.chain = function(a) {
        return x(a).chain()
    }
    ;
    var M = function(a) {
        return this._chain ? x(a).chain() : a
    }
    ;
    x.mixin(x),
    y(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(a) {
        var b = d[a];
        x.prototype[a] = function() {
            var c = this._wrapped;
            return b.apply(c, arguments),
            "shift" != a && "splice" != a || 0 !== c.length || delete c[0],
            M.call(this, c)
        }
    }),
    y(["concat", "join", "slice"], function(a) {
        var b = d[a];
        x.prototype[a] = function() {
            return M.call(this, b.apply(this._wrapped, arguments))
        }
    }),
    x.extend(x.prototype, {
        chain: function() {
            return this._chain = !0,
            this
        },
        value: function() {
            return this._wrapped
        }
    })
}
.call(this),
function() {
    function m() {
        return function() {}
    }
    function p(a) {
        return function() {
            return this[a]
        }
    }
    function s(a) {
        return function() {
            return a
        }
    }
    function u(a, b, c) {
        if ("string" == typeof a) {
            if (0 === a.indexOf("#") && (a = a.slice(1)),
            u.xa[a])
                return u.xa[a];
            a = u.w(a)
        }
        if (!a || !a.nodeName)
            throw new TypeError("The element or ID supplied is not valid. (videojs)");
        return a.player || new u.s(a,b,c)
    }
    function D(a) {
        a.u("vjs-lock-showing")
    }
    function E(a, c, d, e) {
        return d !== b ? (a.a.style[c] = -1 !== ("" + d).indexOf("%") || -1 !== ("" + d).indexOf("px") ? d : "auto" === d ? "" : d + "px",
        e || a.j("resize"),
        a) : a.a ? (d = a.a.style[c],
        e = d.indexOf("px"),
        -1 !== e ? parseInt(d.slice(0, e), 10) : parseInt(a.a["offset" + u.$(c)], 10)) : 0
    }
    function F(a, b) {
        var c, d, e, f;
        return c = a.a,
        d = u.ad(c),
        f = e = c.offsetWidth,
        c = a.handle,
        a.g.Cd ? (f = d.top,
        d = b.changedTouches ? b.changedTouches[0].pageY : b.pageY,
        c && (c = c.w().offsetHeight,
        f += c / 2,
        e -= c),
        Math.max(0, Math.min(1, (f - d + e) / e))) : (e = d.left,
        d = b.changedTouches ? b.changedTouches[0].pageX : b.pageX,
        c && (c = c.w().offsetWidth,
        e += c / 2,
        f -= c),
        Math.max(0, Math.min(1, (d - e) / f)))
    }
    function ca(a, b) {
        a.Z(b),
        b.d("click", u.bind(a, function() {
            D(this)
        }))
    }
    function H(a) {
        a.pa = f,
        a.wa.n("vjs-lock-showing"),
        a.a.setAttribute("aria-pressed", f),
        a.I && 0 < a.I.length && a.I[0].w().focus()
    }
    function G(a) {
        a.pa = l,
        D(a.wa),
        a.a.setAttribute("aria-pressed", l)
    }
    function da(a) {
        var b = {
            sources: [],
            tracks: []
        };
        if (u.k.B(b, u.xb(a)),
        a.hasChildNodes()) {
            var c, d, e, f;
            for (a = a.childNodes,
            e = 0,
            f = a.length; f > e; e++)
                c = a[e],
                d = c.nodeName.toLowerCase(),
                "source" === d ? b.sources.push(u.xb(c)) : "track" === d && b.tracks.push(u.xb(c))
        }
        return b
    }
    function I(a, b, c) {
        a.h ? (a.aa = l,
        a.h.D(),
        a.Eb && (a.Eb = l,
        clearInterval(a.Ra)),
        a.Fb && J(a),
        a.h = l) : "Html5" !== b && a.M && (u.l.jc(a.M),
        a.M = h),
        a.ia = b,
        a.aa = l;
        var d = u.k.B({
            source: c,
            parentEl: a.a
        }, a.g[b.toLowerCase()]);
        c && (c.src == a.v.src && 0 < a.v.currentTime && (d.startTime = a.v.currentTime),
        a.v.src = c.src),
        a.h = new window.videojs[b](a,d),
        a.h.L(function() {
            if (this.b.Ua(),
            !this.m.progressEvents) {
                var a = this.b;
                a.Eb = f,
                a.Ra = setInterval(u.bind(a, function() {
                    this.v.lb < this.buffered().end(0) ? this.j("progress") : 1 == this.Ja() && (clearInterval(this.Ra),
                    this.j("progress"))
                }), 500),
                a.h.U("progress", function() {
                    this.m.progressEvents = f;
                    var a = this.b;
                    a.Eb = l,
                    clearInterval(a.Ra)
                })
            }
            this.m.timeupdateEvents || (a = this.b,
            a.Fb = f,
            a.d("play", a.Cc),
            a.d("pause", a.za),
            a.h.U("timeupdate", function() {
                this.m.timeupdateEvents = f,
                J(this.b)
            }))
        })
    }
    function J(a) {
        a.Fb = l,
        a.za(),
        a.o("play", a.Cc),
        a.o("pause", a.za)
    }
    function L(a, b, c) {
        if (a.h && !a.h.aa)
            a.h.L(function() {
                this[b](c)
            });
        else
            try {
                a.h[b](c)
            } catch (d) {
                throw u.log(d),
                d
            }
    }
    function K(a, c) {
        if (a.h && a.h.aa)
            try {
                return a.h[c]()
            } catch (d) {
                throw a.h[c] === b ? u.log("Video.js: " + c + " method not defined for " + a.ia + " playback technology.", d) : "TypeError" == d.name ? (u.log("Video.js: " + c + " unavailable on " + a.ia + " playback technology element.", d),
                a.h.aa = l) : u.log(d),
                d
            }
    }
    function M(a) {
        a.cd = l,
        u.o(document, "keydown", a.lc),
        document.documentElement.style.overflow = a.Yc,
        u.u(document.body, "vjs-full-window"),
        a.j("exitFullWindow")
    }
    function ea() {
        var a = u.media.Va[i];
        return function() {
            throw Error('The "' + a + "\" method is not available on the playback technology's API")
        }
    }
    function fa() {
        var a = R[T]
          , b = a.charAt(0).toUpperCase() + a.slice(1);
        Q["set" + b] = function(b) {
            return this.a.vjs_setProperty(a, b)
        }
    }
    function U(a) {
        Q[a] = function() {
            return this.a.vjs_getProperty(a)
        }
    }
    function V(a) {
        return a.Aa = a.Aa || [],
        a.Aa
    }
    function W(a, b, c) {
        for (var d, e, f = a.Aa, g = 0, h = f.length; h > g; g++)
            d = f[g],
            d.id() === b ? (d.show(),
            e = d) : c && d.J() == c && 0 < d.mode() && d.disable();
        (b = e ? e.J() : c ? c : l) && a.j(b + "trackchange")
    }
    function X(a) {
        0 === a.ha && a.load(),
        0 === a.ga && (a.b.d("timeupdate", u.bind(a, a.update, a.Q)),
        a.b.d("ended", u.bind(a, a.reset, a.Q)),
        ("captions" === a.A || "subtitles" === a.A) && a.b.V.textTrackDisplay.Z(a))
    }
    function Y(a) {
        var b = a.split(":");
        a = 0;
        var c, d, e;
        return 3 == b.length ? (c = b[0],
        d = b[1],
        b = b[2]) : (c = 0,
        d = b[0],
        b = b[1]),
        b = b.split(/\s+/),
        b = b.splice(0, 1)[0],
        b = b.split(/\.|,/),
        e = parseFloat(b[1]),
        b = b[0],
        a += 3600 * parseFloat(c),
        a += 60 * parseFloat(d),
        a += parseFloat(b),
        e && (a += e / 1e3),
        a
    }
    function $(a, c) {
        var d = a.split(".")
          , e = ga;
        !(d[0]in e) && e.execScript && e.execScript("var " + d[0]);
        for (var f; d.length && (f = d.shift()); )
            d.length || c === b ? e = e[f] ? e[f] : e[f] = {} : e[f] = c
    }
    var b = void 0, f = !0, h = null , l = !1, t;
    document.createElement("video"),
    document.createElement("audio"),
    document.createElement("track");
    var v = u;
    window.Td = window.Ud = u,
    u.Tb = "4.3",
    u.Fc = "https:" == document.location.protocol ? "https://" : "http://",
    u.options = {
        techOrder: ["html5", "flash"],
        html5: {},
        flash: {},
        width: 300,
        height: 150,
        defaultVolume: 0,
        children: {
            mediaLoader: {},
            posterImage: {},
            textTrackDisplay: {},
            loadingSpinner: {},
            bigPlayButton: {},
            controlBar: {}
        },
        notSupportedMessage: 'Sorry, no compatible source and playback technology were found for this video. Try using another browser like <a href="http://bit.ly/ccMUEC">Chrome</a> or download the latest <a href="http://adobe.ly/mwfN1">Adobe Flash Player</a>.'
    },
    "GENERATED_CDN_VSN" !== u.Tb && (v.options.flash.swf = u.Fc + "vjs.zencdn.net/" + u.Tb + "/video-js.swf"),
    u.xa = {},
    u.la = u.CoreObject = m(),
    u.la.extend = function(a) {
        var b, c;
        a = a || {},
        b = a.init || a.i || this.prototype.init || this.prototype.i || m(),
        c = function() {
            b.apply(this, arguments)
        }
        ,
        c.prototype = u.k.create(this.prototype),
        c.prototype.constructor = c,
        c.extend = u.la.extend,
        c.create = u.la.create;
        for (var d in a)
            a.hasOwnProperty(d) && (c.prototype[d] = a[d]);
        return c
    }
    ,
    u.la.create = function() {
        var a = u.k.create(this.prototype);
        return this.apply(a, arguments),
        a
    }
    ,
    u.d = function(a, b, c) {
        var d = u.getData(a);
        d.z || (d.z = {}),
        d.z[b] || (d.z[b] = []),
        c.t || (c.t = u.t++),
        d.z[b].push(c),
        d.W || (d.disabled = l,
        d.W = function(b) {
            if (!d.disabled) {
                b = u.kc(b);
                var c = d.z[b.type];
                if (c)
                    for (var c = c.slice(0), e = 0, f = c.length; f > e && !b.pc(); e++)
                        c[e].call(a, b)
            }
        }
        ),
        1 == d.z[b].length && (document.addEventListener ? a.addEventListener(b, d.W, l) : document.attachEvent && a.attachEvent("on" + b, d.W))
    }
    ,
    u.o = function(a, b, c) {
        if (u.oc(a)) {
            var d = u.getData(a);
            if (d.z)
                if (b) {
                    var e = d.z[b];
                    if (e) {
                        if (c) {
                            if (c.t)
                                for (d = 0; d < e.length; d++)
                                    e[d].t === c.t && e.splice(d--, 1)
                        } else
                            d.z[b] = [];
                        u.gc(a, b)
                    }
                } else
                    for (e in d.z)
                        b = e,
                        d.z[b] = [],
                        u.gc(a, b)
        }
    }
    ,
    u.gc = function(a, b) {
        var c = u.getData(a);
        0 === c.z[b].length && (delete c.z[b],
        document.removeEventListener ? a.removeEventListener(b, c.W, l) : document.detachEvent && a.detachEvent("on" + b, c.W)),
        u.Bb(c.z) && (delete c.z,
        delete c.W,
        delete c.disabled),
        u.Bb(c) && u.vc(a)
    }
    ,
    u.kc = function(a) {
        function b() {
            return f
        }
        function c() {
            return l
        }
        if (!a || !a.Cb) {
            var d = a || window.event;
            a = {};
            for (var e in d)
                "layerX" !== e && "layerY" !== e && (a[e] = d[e]);
            if (a.target || (a.target = a.srcElement || document),
            a.relatedTarget = a.fromElement === a.target ? a.toElement : a.fromElement,
            a.preventDefault = function() {
                d.preventDefault && d.preventDefault(),
                a.returnValue = l,
                a.Ab = b
            }
            ,
            a.Ab = c,
            a.stopPropagation = function() {
                d.stopPropagation && d.stopPropagation(),
                a.cancelBubble = f,
                a.Cb = b
            }
            ,
            a.Cb = c,
            a.stopImmediatePropagation = function() {
                d.stopImmediatePropagation && d.stopImmediatePropagation(),
                a.pc = b,
                a.stopPropagation()
            }
            ,
            a.pc = c,
            a.clientX != h) {
                e = document.documentElement;
                var g = document.body;
                a.pageX = a.clientX + (e && e.scrollLeft || g && g.scrollLeft || 0) - (e && e.clientLeft || g && g.clientLeft || 0),
                a.pageY = a.clientY + (e && e.scrollTop || g && g.scrollTop || 0) - (e && e.clientTop || g && g.clientTop || 0)
            }
            a.which = a.charCode || a.keyCode,
            a.button != h && (a.button = 1 & a.button ? 0 : 4 & a.button ? 1 : 2 & a.button ? 2 : 0)
        }
        return a
    }
    ,
    u.j = function(a, b) {
        var c = u.oc(a) ? u.getData(a) : {}
          , d = a.parentNode || a.ownerDocument;
        return "string" == typeof b && (b = {
            type: b,
            target: a
        }),
        b = u.kc(b),
        c.W && c.W.call(a, b),
        d && !b.Cb() && b.bubbles !== l ? u.j(d, b) : d || b.Ab() || (c = u.getData(b.target),
        !b.target[b.type]) || (c.disabled = f,
        "function" == typeof b.target[b.type] && b.target[b.type](),
        c.disabled = l),
        !b.Ab()
    }
    ,
    u.U = function(a, b, c) {
        function d() {
            u.o(a, b, d),
            c.apply(this, arguments)
        }
        d.t = c.t = c.t || u.t++,
        u.d(a, b, d)
    }
    ;
    var w = Object.prototype.hasOwnProperty;
    u.e = function(a, b) {
        var c, d;
        c = document.createElement(a || "div");
        for (d in b)
            w.call(b, d) && (-1 !== d.indexOf("aria-") || "role" == d ? c.setAttribute(d, b[d]) : c[d] = b[d]);
        return c
    }
    ,
    u.$ = function(a) {
        return a.charAt(0).toUpperCase() + a.slice(1)
    }
    ,
    u.k = {},
    u.k.create = Object.create || function(a) {
        function b() {}
        return b.prototype = a,
        new b
    }
    ,
    u.k.ua = function(a, b, c) {
        for (var d in a)
            w.call(a, d) && b.call(c || this, d, a[d])
    }
    ,
    u.k.B = function(a, b) {
        if (!b)
            return a;
        for (var c in b)
            w.call(b, c) && (a[c] = b[c]);
        return a
    }
    ,
    u.k.ic = function(a, b) {
        var c, d, e;
        a = u.k.copy(a);
        for (c in b)
            w.call(b, c) && (d = a[c],
            e = b[c],
            a[c] = u.k.qc(d) && u.k.qc(e) ? u.k.ic(d, e) : b[c]);
        return a
    }
    ,
    u.k.copy = function(a) {
        return u.k.B({}, a)
    }
    ,
    u.k.qc = function(a) {
        return !!a && "object" == typeof a && "[object Object]" === a.toString() && a.constructor === Object
    }
    ,
    u.bind = function(a, b, c) {
        function d() {
            return b.apply(a, arguments)
        }
        return b.t || (b.t = u.t++),
        d.t = c ? c + "_" + b.t : b.t,
        d
    }
    ,
    u.ra = {},
    u.t = 1,
    u.expando = "vdata" + (new Date).getTime(),
    u.getData = function(a) {
        var b = a[u.expando];
        return b || (b = a[u.expando] = u.t++,
        u.ra[b] = {}),
        u.ra[b]
    }
    ,
    u.oc = function(a) {
        return a = a[u.expando],
        !(!a || u.Bb(u.ra[a]))
    }
    ,
    u.vc = function(a) {
        var b = a[u.expando];
        if (b) {
            delete u.ra[b];
            try {
                delete a[u.expando]
            } catch (c) {
                a.removeAttribute ? a.removeAttribute(u.expando) : a[u.expando] = h
            }
        }
    }
    ,
    u.Bb = function(a) {
        for (var b in a)
            if (a[b] !== h)
                return l;
        return f
    }
    ,
    u.n = function(a, b) {
        -1 == (" " + a.className + " ").indexOf(" " + b + " ") && (a.className = "" === a.className ? b : a.className + " " + b)
    }
    ,
    u.u = function(a, b) {
        var c, d;
        if (-1 != a.className.indexOf(b)) {
            for (c = a.className.split(" "),
            d = c.length - 1; d >= 0; d--)
                c[d] === b && c.splice(d, 1);
            a.className = c.join(" ")
        }
    }
    ,
    u.na = u.e("video"),
    u.F = navigator.userAgent,
    u.Mc = /iPhone/i.test(u.F),
    u.Lc = /iPad/i.test(u.F),
    u.Nc = /iPod/i.test(u.F),
    u.Kc = u.Mc || u.Lc || u.Nc;
    var aa = u, x, y = u.F.match(/OS (\d+)_/i);
    x = y && y[1] ? y[1] : b,
    aa.Fd = x,
    u.Ic = /Android/i.test(u.F);
    var ba = u, z, A = u.F.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i), B, C;
    A ? (B = A[1] && parseFloat(A[1]),
    C = A[2] && parseFloat(A[2]),
    z = B && C ? parseFloat(A[1] + "." + A[2]) : B ? B : h) : z = h,
    ba.Gc = z,
    u.Oc = u.Ic && /webkit/i.test(u.F) && 2.3 > u.Gc,
    u.Jc = /Firefox/i.test(u.F),
    u.Gd = /Chrome/i.test(u.F),
    u.ac = !!("ontouchstart"in window || window.Hc && document instanceof window.Hc),
    u.xb = function(a) {
        var b, c, d, e;
        if (b = {},
        a && a.attributes && 0 < a.attributes.length) {
            c = a.attributes;
            for (var g = c.length - 1; g >= 0; g--)
                d = c[g].name,
                e = c[g].value,
                ("boolean" == typeof a[d] || -1 !== ",autoplay,controls,loop,muted,default,".indexOf("," + d + ",")) && (e = e !== h ? f : l),
                b[d] = e
        }
        return b
    }
    ,
    u.Kd = function(a, b) {
        var c = "";
        return document.defaultView && document.defaultView.getComputedStyle ? c = document.defaultView.getComputedStyle(a, "").getPropertyValue(b) : a.currentStyle && (c = a["client" + b.substr(0, 1).toUpperCase() + b.substr(1)] + "px"),
        c
    }
    ,
    u.zb = function(a, b) {
        b.firstChild ? b.insertBefore(a, b.firstChild) : b.appendChild(a)
    }
    ,
    u.Pb = {},
    u.w = function(a) {
        return 0 === a.indexOf("#") && (a = a.slice(1)),
        document.getElementById(a)
    }
    ,
    u.La = function(a, b) {
        b = b || a;
        var c = Math.floor(a % 60)
          , d = Math.floor(a / 60 % 60)
          , e = Math.floor(a / 3600)
          , f = Math.floor(b / 60 % 60)
          , g = Math.floor(b / 3600);
        return (isNaN(a) || 1 / 0 === a) && (e = d = c = "-"),
        e = e > 0 || g > 0 ? e + ":" : "",
        e + (((e || f >= 10) && 10 > d ? "0" + d : d) + ":") + (10 > c ? "0" + c : c)
    }
    ,
    u.Tc = function() {
        document.body.focus(),
        document.onselectstart = s(l)
    }
    ,
    u.Bd = function() {
        document.onselectstart = s(f)
    }
    ,
    u.trim = function(a) {
        return (a + "").replace(/^\s+|\s+$/g, "")
    }
    ,
    u.round = function(a, b) {
        return b || (b = 0),
        Math.round(a * Math.pow(10, b)) / Math.pow(10, b)
    }
    ,
    u.tb = function(a, b) {
        return {
            length: 1,
            start: function() {
                return a
            },
            end: function() {
                return b
            }
        }
    }
    ,
    u.get = function(a, b, c) {
        var d, e;
        "undefined" == typeof XMLHttpRequest && (window.XMLHttpRequest = function() {
            try {
                return new window.ActiveXObject("Msxml2.XMLHTTP.6.0")
            } catch (a) {}
            try {
                return new window.ActiveXObject("Msxml2.XMLHTTP.3.0")
            } catch (b) {}
            try {
                return new window.ActiveXObject("Msxml2.XMLHTTP")
            } catch (c) {}
            throw Error("This browser does not support XMLHttpRequest.")
        }
        ),
        e = new XMLHttpRequest;
        try {
            e.open("GET", a)
        } catch (f) {
            c(f)
        }
        d = 0 === a.indexOf("file:") || 0 === window.location.href.indexOf("file:") && -1 === a.indexOf("http"),
        e.onreadystatechange = function() {
            4 === e.readyState && (200 === e.status || d && 0 === e.status ? b(e.responseText) : c && c())
        }
        ;
        try {
            e.send()
        } catch (g) {
            c && c(g)
        }
    }
    ,
    u.td = function(a) {
        try {
            var b = window.localStorage || l;
            b && (b.volume = a)
        } catch (c) {
            22 == c.code || 1014 == c.code ? u.log("LocalStorage Full (VideoJS)", c) : 18 == c.code ? u.log("LocalStorage not allowed (VideoJS)", c) : u.log("LocalStorage Error (VideoJS)", c)
        }
    }
    ,
    u.mc = function(a) {
        return a.match(/^https?:\/\//) || (a = u.e("div", {
            innerHTML: '<a href="' + a + '">x</a>'
        }).firstChild.href),
        a
    }
    ,
    u.log = function() {
        u.log.history = u.log.history || [],
        u.log.history.push(arguments),
        window.console && window.console.log(Array.prototype.slice.call(arguments))
    }
    ,
    u.ad = function(a) {
        var b, c;
        return a.getBoundingClientRect && a.parentNode && (b = a.getBoundingClientRect()),
        b ? (a = document.documentElement,
        c = document.body,
        {
            left: b.left + (window.pageXOffset || c.scrollLeft) - (a.clientLeft || c.clientLeft || 0),
            top: b.top + (window.pageYOffset || c.scrollTop) - (a.clientTop || c.clientTop || 0)
        }) : {
            left: 0,
            top: 0
        }
    }
    ,
    u.c = u.la.extend({
        i: function(a, b, c) {
            if (this.b = a,
            this.g = u.k.copy(this.g),
            b = this.options(b),
            this.Q = b.id || (b.el && b.el.id ? b.el.id : a.id() + "_component_" + u.t++),
            this.gd = b.name || h,
            this.a = b.el || this.e(),
            this.G = [],
            this.qb = {},
            this.V = {},
            (a = this.g) && a.children) {
                var d = this;
                u.k.ua(a.children, function(a, b) {
                    b !== l && !b.loadEvent && (d[a] = d.Z(a, b))
                })
            }
            this.L(c)
        }
    }),
    t = u.c.prototype,
    t.D = function() {
        if (this.j("dispose"),
        this.G)
            for (var a = this.G.length - 1; a >= 0; a--)
                this.G[a].D && this.G[a].D();
        this.V = this.qb = this.G = h,
        this.o(),
        this.a.parentNode && this.a.parentNode.removeChild(this.a),
        u.vc(this.a),
        this.a = h
    }
    ,
    t.b = f,
    t.K = p("b"),
    t.options = function(a) {
        return a === b ? this.g : this.g = u.k.ic(this.g, a)
    }
    ,
    t.e = function(a, b) {
        return u.e(a, b)
    }
    ,
    t.w = p("a"),
    t.id = p("Q"),
    t.name = p("gd"),
    t.children = p("G"),
    t.Z = function(a, b) {
        var c, d;
        return "string" == typeof a ? (d = a,
        b = b || {},
        c = b.componentClass || u.$(d),
        b.name = d,
        c = new window.videojs[c](this.b || this,b)) : c = a,
        this.G.push(c),
        "function" == typeof c.id && (this.qb[c.id()] = c),
        (d = d || c.name && c.name()) && (this.V[d] = c),
        "function" == typeof c.el && c.el() && (this.sa || this.a).appendChild(c.el()),
        c
    }
    ,
    t.removeChild = function(a) {
        if ("string" == typeof a && (a = this.V[a]),
        a && this.G) {
            for (var b = l, c = this.G.length - 1; c >= 0; c--)
                if (this.G[c] === a) {
                    b = f,
                    this.G.splice(c, 1);
                    break
                }
            b && (this.qb[a.id] = h,
            this.V[a.name] = h,
            (b = a.w()) && b.parentNode === (this.sa || this.a) && (this.sa || this.a).removeChild(a.w()))
        }
    }
    ,
    t.T = s(""),
    t.d = function(a, b) {
        return u.d(this.a, a, u.bind(this, b)),
        this
    }
    ,
    t.o = function(a, b) {
        return u.o(this.a, a, b),
        this
    }
    ,
    t.U = function(a, b) {
        return u.U(this.a, a, u.bind(this, b)),
        this
    }
    ,
    t.j = function(a, b) {
        return u.j(this.a, a, b),
        this
    }
    ,
    t.L = function(a) {
        return a && (this.aa ? a.call(this) : (this.Sa === b && (this.Sa = []),
        this.Sa.push(a))),
        this
    }
    ,
    t.Ua = function() {
        this.aa = f;
        var a = this.Sa;
        if (a && 0 < a.length) {
            for (var b = 0, c = a.length; c > b; b++)
                a[b].call(this);
            this.Sa = [],
            this.j("ready")
        }
    }
    ,
    t.n = function(a) {
        return u.n(this.a, a),
        this
    }
    ,
    t.u = function(a) {
        return u.u(this.a, a),
        this
    }
    ,
    t.show = function() {
        return this.a.style.display = "block",
        this
    }
    ,
    t.C = function() {
        return this.a.style.display = "none",
        this
    }
    ,
    t.disable = function() {
        this.C(),
        this.show = m()
    }
    ,
    t.width = function(a, b) {
        return E(this, "width", a, b)
    }
    ,
    t.height = function(a, b) {
        return E(this, "height", a, b)
    }
    ,
    t.Xc = function(a, b) {
        return this.width(a, f).height(b)
    }
    ,
    u.q = u.c.extend({
        i: function(a, b) {
            u.c.call(this, a, b);
            var c = l;
            this.d("touchstart", function(a) {
                a.preventDefault(),
                c = f
            }),
            this.d("touchmove", function() {
                c = l
            });
            var d = this;
            this.d("touchend", function(a) {
                c && d.p(a),
                a.preventDefault()
            }),
            this.d("click", this.p),
            this.d("focus", this.Oa),
            this.d("blur", this.Na)
        }
    }),
    t = u.q.prototype,
    t.e = function(a, b) {
        return b = u.k.B({
            className: this.T(),
            innerHTML: '<div class="vjs-control-content"><span class="vjs-control-text">' + (this.qa || "Need Text") + "</span></div>",
            qd: "button",
            "aria-live": "polite",
            tabIndex: 0
        }, b),
        u.c.prototype.e.call(this, a, b)
    }
    ,
    t.T = function() {
        return "vjs-control " + u.c.prototype.T.call(this)
    }
    ,
    t.p = m(),
    t.Oa = function() {
        u.d(document, "keyup", u.bind(this, this.ba))
    }
    ,
    t.ba = function(a) {
        (32 == a.which || 13 == a.which) && (a.preventDefault(),
        this.p())
    }
    ,
    t.Na = function() {
        u.o(document, "keyup", u.bind(this, this.ba))
    }
    ,
    u.O = u.c.extend({
        i: function(a, b) {
            u.c.call(this, a, b),
            this.Sc = this.V[this.g.barName],
            this.handle = this.V[this.g.handleName],
            a.d(this.tc, u.bind(this, this.update)),
            this.d("mousedown", this.Pa),
            this.d("touchstart", this.Pa),
            this.d("focus", this.Oa),
            this.d("blur", this.Na),
            this.d("click", this.p),
            this.b.d("controlsvisible", u.bind(this, this.update)),
            a.L(u.bind(this, this.update)),
            this.P = {}
        }
    }),
    t = u.O.prototype,
    t.e = function(a, b) {
        return b = b || {},
        b.className += " vjs-slider",
        b = u.k.B({
            qd: "slider",
            "aria-valuenow": 0,
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            tabIndex: 0
        }, b),
        u.c.prototype.e.call(this, a, b)
    }
    ,
    t.Pa = function(a) {
        a.preventDefault(),
        u.Tc(),
        this.P.move = u.bind(this, this.Hb),
        this.P.end = u.bind(this, this.Ib),
        u.d(document, "mousemove", this.P.move),
        u.d(document, "mouseup", this.P.end),
        u.d(document, "touchmove", this.P.move),
        u.d(document, "touchend", this.P.end),
        this.Hb(a)
    }
    ,
    t.Ib = function() {
        u.Bd(),
        u.o(document, "mousemove", this.P.move, l),
        u.o(document, "mouseup", this.P.end, l),
        u.o(document, "touchmove", this.P.move, l),
        u.o(document, "touchend", this.P.end, l),
        this.update()
    }
    ,
    t.update = function() {
        if (this.a) {
            var a, b = this.yb(), c = this.handle, d = this.Sc;
            if (isNaN(b) && (b = 0),
            a = b,
            c) {
                a = this.a.offsetWidth;
                var e = c.w().offsetWidth;
                a = e ? e / a : 0,
                b *= 1 - a,
                a = b + a / 2,
                c.w().style.left = u.round(100 * b, 2) + "%"
            }
            d.w().style.width = u.round(100 * a, 2) + "%"
        }
    }
    ,
    t.Oa = function() {
        u.d(document, "keyup", u.bind(this, this.ba))
    }
    ,
    t.ba = function(a) {
        37 == a.which ? (a.preventDefault(),
        this.yc()) : 39 == a.which && (a.preventDefault(),
        this.zc())
    }
    ,
    t.Na = function() {
        u.o(document, "keyup", u.bind(this, this.ba))
    }
    ,
    t.p = function(a) {
        a.stopImmediatePropagation(),
        a.preventDefault()
    }
    ,
    u.ea = u.c.extend(),
    u.ea.prototype.defaultValue = 0,
    u.ea.prototype.e = function(a, b) {
        return b = b || {},
        b.className += " vjs-slider-handle",
        b = u.k.B({
            innerHTML: '<span class="vjs-control-text">' + this.defaultValue + "</span>"
        }, b),
        u.c.prototype.e.call(this, "div", b)
    }
    ,
    u.ma = u.c.extend(),
    u.ma.prototype.e = function() {
        var a = this.options().Vc || "ul";
        return this.sa = u.e(a, {
            className: "vjs-menu-content"
        }),
        a = u.c.prototype.e.call(this, "div", {
            append: this.sa,
            className: "vjs-menu"
        }),
        a.appendChild(this.sa),
        u.d(a, "click", function(a) {
            a.preventDefault(),
            a.stopImmediatePropagation()
        }),
        a
    }
    ,
    u.N = u.q.extend({
        i: function(a, b) {
            u.q.call(this, a, b),
            this.selected(b.selected)
        }
    }),
    u.N.prototype.e = function(a, b) {
        return u.q.prototype.e.call(this, "li", u.k.B({
            className: "vjs-menu-item",
            innerHTML: this.g.label
        }, b))
    }
    ,
    u.N.prototype.p = function() {
        this.selected(f)
    }
    ,
    u.N.prototype.selected = function(a) {
        a ? (this.n("vjs-selected"),
        this.a.setAttribute("aria-selected", f)) : (this.u("vjs-selected"),
        this.a.setAttribute("aria-selected", l))
    }
    ,
    u.R = u.q.extend({
        i: function(a, b) {
            u.q.call(this, a, b),
            this.wa = this.Ka(),
            this.Z(this.wa),
            this.I && 0 === this.I.length && this.C(),
            this.d("keyup", this.ba),
            this.a.setAttribute("aria-haspopup", f),
            this.a.setAttribute("role", "button")
        }
    }),
    t = u.R.prototype,
    t.pa = l,
    t.Ka = function() {
        var a = new u.ma(this.b);
        if (this.options().title && a.w().appendChild(u.e("li", {
            className: "vjs-menu-title",
            innerHTML: u.$(this.A),
            zd: -1
        })),
        this.I = this.createItems())
            for (var b = 0; b < this.I.length; b++)
                ca(a, this.I[b]);
        return a
    }
    ,
    t.ta = m(),
    t.T = function() {
        return this.className + " vjs-menu-button " + u.q.prototype.T.call(this)
    }
    ,
    t.Oa = m(),
    t.Na = m(),
    t.p = function() {
        this.U("mouseout", u.bind(this, function() {
            D(this.wa),
            this.a.blur()
        })),
        this.pa ? G(this) : H(this)
    }
    ,
    t.ba = function(a) {
        a.preventDefault(),
        32 == a.which || 13 == a.which ? this.pa ? G(this) : H(this) : 27 == a.which && this.pa && G(this)
    }
    ,
    u.s = u.c.extend({
        i: function(a, b, c) {
            this.M = a,
            b = u.k.B(da(a), b),
            this.v = {},
            this.uc = b.poster,
            this.sb = b.controls,
            a.controls = l,
            u.c.call(this, this, b, c),
            this.n(this.controls() ? "vjs-controls-enabled" : "vjs-controls-disabled"),
            this.U("play", function(a) {
                u.j(this.a, {
                    type: "firstplay",
                    target: this.a
                }) || (a.preventDefault(),
                a.stopPropagation(),
                a.stopImmediatePropagation())
            }),
            this.d("ended", this.hd),
            this.d("play", this.Kb),
            this.d("firstplay", this.jd),
            this.d("pause", this.Jb),
            this.d("progress", this.ld),
            this.d("durationchange", this.sc),
            this.d("error", this.Gb),
            this.d("fullscreenchange", this.kd),
            u.xa[this.Q] = this,
            b.plugins && u.k.ua(b.plugins, function(a, b) {
                this[a](b)
            }, this);
            var d, e, g, h;
            d = this.Mb,
            a = function() {
                d(),
                clearInterval(e),
                e = setInterval(u.bind(this, d), 250)
            }
            ,
            b = function() {
                d(),
                clearInterval(e)
            }
            ,
            this.d("mousedown", a),
            this.d("mousemove", d),
            this.d("mouseup", b),
            this.d("keydown", d),
            this.d("keyup", d),
            this.d("touchstart", a),
            this.d("touchmove", d),
            this.d("touchend", b),
            this.d("touchcancel", b),
            g = setInterval(u.bind(this, function() {
                this.ka && (this.ka = l,
                this.ja(f),
                clearTimeout(h),
                h = setTimeout(u.bind(this, function() {
                    this.ka || this.ja(l)
                }), 2e3))
            }), 250),
            this.d("dispose", function() {
                clearInterval(g),
                clearTimeout(h)
            })
        }
    }),
    t = u.s.prototype,
    t.g = u.options,
    t.D = function() {
        this.j("dispose"),
        this.o("dispose"),
        u.xa[this.Q] = h,
        this.M && this.M.player && (this.M.player = h),
        this.a && this.a.player && (this.a.player = h),
        clearInterval(this.Ra),
        this.za(),
        this.h && this.h.D(),
        u.c.prototype.D.call(this)
    }
    ,
    t.e = function() {
        var a = this.a = u.c.prototype.e.call(this, "div")
          , b = this.M;
        if (b.removeAttribute("width"),
        b.removeAttribute("height"),
        b.hasChildNodes()) {
            var c, d, e, g, h;
            for (c = b.childNodes,
            d = c.length,
            h = []; d--; )
                e = c[d],
                g = e.nodeName.toLowerCase(),
                "track" === g && h.push(e);
            for (c = 0; c < h.length; c++)
                b.removeChild(h[c])
        }
        return b.id = b.id || "vjs_video_" + u.t++,
        a.id = b.id,
        a.className = b.className,
        b.id += "_html5_api",
        b.className = "vjs-tech",
        b.player = a.player = this,
        this.n("vjs-paused"),
        this.width(this.g.width, f),
        this.height(this.g.height, f),
        b.parentNode && b.parentNode.insertBefore(a, b),
        u.zb(b, a),
        a
    }
    ,
    t.Cc = function() {
        this.hc && this.za(),
        this.hc = setInterval(u.bind(this, function() {
            this.j("timeupdate")
        }), 250)
    }
    ,
    t.za = function() {
        clearInterval(this.hc)
    }
    ,
    t.Kb = function() {
        u.u(this.a, "vjs-paused"),
        u.n(this.a, "vjs-playing")
    }
    ,
    t.jd = function() {
        this.g.starttime && this.currentTime(this.g.starttime),
        this.n("vjs-has-started")
    }
    ,
    t.Jb = function() {
        u.u(this.a, "vjs-playing"),
        u.n(this.a, "vjs-paused")
    }
    ,
    t.ld = function() {
        1 == this.Ja() && this.j("loadedalldata")
    }
    ,
    t.hd = function() {
        this.g.loop && (this.currentTime(0),
        this.play())
    }
    ,
    t.sc = function() {
        this.duration(K(this, "duration"))
    }
    ,
    t.kd = function() {
        this.H ? this.n("vjs-fullscreen") : this.u("vjs-fullscreen")
    }
    ,
    t.Gb = function(a) {
        u.log("Video Error", a)
    }
    ,
    t.play = function() {
        return L(this, "play"),
        this
    }
    ,
    t.pause = function() {
        return L(this, "pause"),
        this
    }
    ,
    t.paused = function() {
        return K(this, "paused") === l ? l : f
    }
    ,
    t.currentTime = function(a) {
        return a !== b ? (this.v.rc = a,
        L(this, "setCurrentTime", a),
        this.Fb && this.j("timeupdate"),
        this) : this.v.currentTime = K(this, "currentTime") || 0
    }
    ,
    t.duration = function(a) {
        return a !== b ? (this.v.duration = parseFloat(a),
        this) : (this.v.duration === b && this.sc(),
        this.v.duration)
    }
    ,
    t.buffered = function() {
        var a = K(this, "buffered")
          , b = a.length - 1
          , c = this.v.lb = this.v.lb || 0;
        return a && b >= 0 && a.end(b) !== c && (c = a.end(b),
        this.v.lb = c),
        u.tb(0, c)
    }
    ,
    t.Ja = function() {
        return this.duration() ? this.buffered().end(0) / this.duration() : 0
    }
    ,
    t.volume = function(a) {
        return a !== b ? (a = Math.max(0, Math.min(1, parseFloat(a))),
        this.v.volume = a,
        L(this, "setVolume", a),
        u.td(a),
        this) : (a = parseFloat(K(this, "volume")),
        isNaN(a) ? 1 : a)
    }
    ,
    t.muted = function(a) {
        return a !== b ? (L(this, "setMuted", a),
        this) : K(this, "muted") || l
    }
    ,
    t.Ta = function() {
        return K(this, "supportsFullScreen") || l
    }
    ,
    t.ya = function() {
        var a = u.Pb.ya;
        return this.H = f,
        a ? (u.d(document, a.vb, u.bind(this, function() {
            this.H = document[a.H],
            this.H === l && u.o(document, a.vb, arguments.callee),
            this.j("fullscreenchange")
        })),
        this.a[a.wc]()) : this.h.Ta() ? L(this, "enterFullScreen") : (this.cd = f,
        this.Yc = document.documentElement.style.overflow,
        u.d(document, "keydown", u.bind(this, this.lc)),
        document.documentElement.style.overflow = "hidden",
        u.n(document.body, "vjs-full-window"),
        this.j("enterFullWindow"),
        this.j("fullscreenchange")),
        this
    }
    ,
    t.ob = function() {
        var a = u.Pb.ya;
        return this.H = l,
        a ? document[a.nb]() : this.h.Ta() ? L(this, "exitFullScreen") : (M(this),
        this.j("fullscreenchange")),
        this
    }
    ,
    t.lc = function(a) {
        27 === a.keyCode && (this.H === f ? this.ob() : M(this))
    }
    ,
    t.src = function(a) {
        if (a instanceof Array) {
            var b;
            a: {
                b = a;
                for (var c = 0, d = this.g.techOrder; c < d.length; c++) {
                    var e = u.$(d[c])
                      , f = window.videojs[e];
                    if (f.isSupported())
                        for (var g = 0, h = b; g < h.length; g++) {
                            var i = h[g];
                            if (f.canPlaySource(i)) {
                                b = {
                                    source: i,
                                    h: e
                                };
                                break a
                            }
                        }
                }
                b = l
            }
            b ? (a = b.source,
            b = b.h,
            b == this.ia ? this.src(a) : I(this, b, a)) : this.a.appendChild(u.e("p", {
                innerHTML: this.options().notSupportedMessage
            }))
        } else
            a instanceof Object ? this.src(window.videojs[this.ia].canPlaySource(a) ? a.src : [a]) : (this.v.src = a,
            this.aa ? (L(this, "src", a),
            "auto" == this.g.preload && this.load(),
            this.g.autoplay && this.play()) : this.L(function() {
                this.src(a)
            }));
        return this
    }
    ,
    t.load = function() {
        return L(this, "load"),
        this
    }
    ,
    t.currentSrc = function() {
        return K(this, "currentSrc") || this.v.src || ""
    }
    ,
    t.Qa = function(a) {
        return a !== b ? (L(this, "setPreload", a),
        this.g.preload = a,
        this) : K(this, "preload")
    }
    ,
    t.autoplay = function(a) {
        return a !== b ? (L(this, "setAutoplay", a),
        this.g.autoplay = a,
        this) : K(this, "autoplay")
    }
    ,
    t.loop = function(a) {
        return a !== b ? (L(this, "setLoop", a),
        this.g.loop = a,
        this) : K(this, "loop")
    }
    ,
    t.poster = function(a) {
        return a !== b ? (this.uc = a,
        this) : this.uc
    }
    ,
    t.controls = function(a) {
        return a !== b ? (a = !!a,
        this.sb !== a && ((this.sb = a) ? (this.u("vjs-controls-disabled"),
        this.n("vjs-controls-enabled"),
        this.j("controlsenabled")) : (this.u("vjs-controls-enabled"),
        this.n("vjs-controls-disabled"),
        this.j("controlsdisabled"))),
        this) : this.sb
    }
    ,
    u.s.prototype.Sb,
    t = u.s.prototype,
    t.Rb = function(a) {
        return a !== b ? (a = !!a,
        this.Sb !== a && ((this.Sb = a) ? (this.n("vjs-using-native-controls"),
        this.j("usingnativecontrols")) : (this.u("vjs-using-native-controls"),
        this.j("usingcustomcontrols"))),
        this) : this.Sb
    }
    ,
    t.error = function() {
        return K(this, "error")
    }
    ,
    t.seeking = function() {
        return K(this, "seeking")
    }
    ,
    t.ka = f,
    t.Mb = function() {
        this.ka = f
    }
    ,
    t.Qb = f,
    t.ja = function(a) {
        return a !== b ? (a = !!a,
        a !== this.Qb && ((this.Qb = a) ? (this.ka = f,
        this.u("vjs-user-inactive"),
        this.n("vjs-user-active"),
        this.j("useractive")) : (this.ka = l,
        this.h.U("mousemove", function(a) {
            a.stopPropagation(),
            a.preventDefault()
        }),
        this.u("vjs-user-active"),
        this.n("vjs-user-inactive"),
        this.j("userinactive"))),
        this) : this.Qb
    }
    ;
    var N, O, P;
    P = document.createElement("div"),
    O = {},
    P.Hd !== b ? (O.wc = "requestFullscreen",
    O.nb = "exitFullscreen",
    O.vb = "fullscreenchange",
    O.H = "fullScreen") : (document.mozCancelFullScreen ? (N = "moz",
    O.H = N + "FullScreen") : (N = "webkit",
    O.H = N + "IsFullScreen"),
    P[N + "RequestFullScreen"] && (O.wc = N + "RequestFullScreen",
    O.nb = N + "CancelFullScreen"),
    O.vb = N + "fullscreenchange"),
    document[O.nb] && (u.Pb.ya = O),
    u.Fa = u.c.extend(),
    u.Fa.prototype.g = {
        Md: "play",
        children: {
            playToggle: {},
            currentTimeDisplay: {},
            timeDivider: {},
            durationDisplay: {},
            remainingTimeDisplay: {},
            progressControl: {},
            fullscreenToggle: {},
            volumeControl: {},
            muteToggle: {}
        }
    },
    u.Fa.prototype.e = function() {
        return u.e("div", {
            className: "vjs-control-bar"
        })
    }
    ,
    u.Yb = u.q.extend({
        i: function(a, b) {
            u.q.call(this, a, b),
            a.d("play", u.bind(this, this.Kb)),
            a.d("pause", u.bind(this, this.Jb))
        }
    }),
    t = u.Yb.prototype,
    t.qa = "Play",
    t.T = function() {
        return "vjs-play-control " + u.q.prototype.T.call(this)
    }
    ,
    t.p = function() {
        this.b.paused() ? this.b.play() : this.b.pause()
    }
    ,
    t.Kb = function() {
        u.u(this.a, "vjs-paused"),
        u.n(this.a, "vjs-playing"),
        this.a.children[0].children[0].innerHTML = "Pause"
    }
    ,
    t.Jb = function() {
        u.u(this.a, "vjs-playing"),
        u.n(this.a, "vjs-paused"),
        this.a.children[0].children[0].innerHTML = "Play"
    }
    ,
    u.Ya = u.c.extend({
        i: function(a, b) {
            u.c.call(this, a, b),
            a.d("timeupdate", u.bind(this, this.Ca))
        }
    }),
    u.Ya.prototype.e = function() {
        var a = u.c.prototype.e.call(this, "div", {
            className: "vjs-current-time vjs-time-controls vjs-control"
        });
        return this.content = u.e("div", {
            className: "vjs-current-time-display",
            innerHTML: '<span class="vjs-control-text">Current Time </span>0:00',
            "aria-live": "off"
        }),
        a.appendChild(u.e("div").appendChild(this.content)),
        a
    }
    ,
    u.Ya.prototype.Ca = function() {
        var a = this.b.Nb ? this.b.v.currentTime : this.b.currentTime();
        this.content.innerHTML = '<span class="vjs-control-text">Current Time </span>' + u.La(a, this.b.duration())
    }
    ,
    u.Za = u.c.extend({
        i: function(a, b) {
            u.c.call(this, a, b),
            a.d("timeupdate", u.bind(this, this.Ca))
        }
    }),
    u.Za.prototype.e = function() {
        var a = u.c.prototype.e.call(this, "div", {
            className: "vjs-duration vjs-time-controls vjs-control"
        });
        return this.content = u.e("div", {
            className: "vjs-duration-display",
            innerHTML: '<span class="vjs-control-text">Duration Time </span>0:00',
            "aria-live": "off"
        }),
        a.appendChild(u.e("div").appendChild(this.content)),
        a
    }
    ,
    u.Za.prototype.Ca = function() {
        var a = this.b.duration();
        a && (this.content.innerHTML = '<span class="vjs-control-text">Duration Time </span>' + u.La(a))
    }
    ,
    u.cc = u.c.extend({
        i: function(a, b) {
            u.c.call(this, a, b)
        }
    }),
    u.cc.prototype.e = function() {
        return u.c.prototype.e.call(this, "div", {
            className: "vjs-time-divider",
            innerHTML: "<div><span>/</span></div>"
        })
    }
    ,
    u.fb = u.c.extend({
        i: function(a, b) {
            u.c.call(this, a, b),
            a.d("timeupdate", u.bind(this, this.Ca))
        }
    }),
    u.fb.prototype.e = function() {
        var a = u.c.prototype.e.call(this, "div", {
            className: "vjs-remaining-time vjs-time-controls vjs-control"
        });
        return this.content = u.e("div", {
            className: "vjs-remaining-time-display",
            innerHTML: '<span class="vjs-control-text">Remaining Time </span>-0:00',
            "aria-live": "off"
        }),
        a.appendChild(u.e("div").appendChild(this.content)),
        a
    }
    ,
    u.fb.prototype.Ca = function() {
        this.b.duration() && (this.content.innerHTML = '<span class="vjs-control-text">Remaining Time </span>-' + u.La(this.b.duration() - this.b.currentTime()))
    }
    ,
    u.Ga = u.q.extend({
        i: function(a, b) {
            u.q.call(this, a, b)
        }
    }),
    u.Ga.prototype.qa = "Fullscreen",
    u.Ga.prototype.T = function() {
        return "vjs-fullscreen-control " + u.q.prototype.T.call(this)
    }
    ,
    u.Ga.prototype.p = function() {
        this.b.H ? (this.b.ob(),
        this.a.children[0].children[0].innerHTML = "Fullscreen") : (this.b.ya(),
        this.a.children[0].children[0].innerHTML = "Non-Fullscreen")
    }
    ,
    u.eb = u.c.extend({
        i: function(a, b) {
            u.c.call(this, a, b)
        }
    }),
    u.eb.prototype.g = {
        children: {
            seekBar: {}
        }
    },
    u.eb.prototype.e = function() {
        return u.c.prototype.e.call(this, "div", {
            className: "vjs-progress-control vjs-control"
        })
    }
    ,
    u.Zb = u.O.extend({
        i: function(a, b) {
            u.O.call(this, a, b),
            a.d("timeupdate", u.bind(this, this.Ba)),
            a.L(u.bind(this, this.Ba))
        }
    }),
    t = u.Zb.prototype,
    t.g = {
        children: {
            loadProgressBar: {},
            playProgressBar: {},
            seekHandle: {}
        },
        barName: "playProgressBar",
        handleName: "seekHandle"
    },
    t.tc = "timeupdate",
    t.e = function() {
        return u.O.prototype.e.call(this, "div", {
            className: "vjs-progress-holder",
            "aria-label": "video progress bar"
        })
    }
    ,
    t.Ba = function() {
        var a = this.b.Nb ? this.b.v.currentTime : this.b.currentTime();
        this.a.setAttribute("aria-valuenow", u.round(100 * this.yb(), 2)),
        this.a.setAttribute("aria-valuetext", u.La(a, this.b.duration()))
    }
    ,
    t.yb = function() {
        var a;
        return "Flash" === this.b.ia && this.b.seeking() ? (a = this.b.v,
        a = a.rc ? a.rc : this.b.currentTime()) : a = this.b.currentTime(),
        a / this.b.duration()
    }
    ,
    t.Pa = function(a) {
        u.O.prototype.Pa.call(this, a),
        this.b.Nb = f,
        this.Dd = !this.b.paused(),
        this.b.pause()
    }
    ,
    t.Hb = function(a) {
        a = F(this, a) * this.b.duration(),
        a == this.b.duration() && (a -= .1),
        this.b.currentTime(a)
    }
    ,
    t.Ib = function(a) {
        u.O.prototype.Ib.call(this, a),
        this.b.Nb = l,
        this.Dd && this.b.play()
    }
    ,
    t.zc = function() {
        this.b.currentTime(this.b.currentTime() + 5)
    }
    ,
    t.yc = function() {
        this.b.currentTime(this.b.currentTime() - 5)
    }
    ,
    u.ab = u.c.extend({
        i: function(a, b) {
            u.c.call(this, a, b),
            a.d("progress", u.bind(this, this.update))
        }
    }),
    u.ab.prototype.e = function() {
        return u.c.prototype.e.call(this, "div", {
            className: "vjs-load-progress",
            innerHTML: '<span class="vjs-control-text">Loaded: 0%</span>'
        })
    }
    ,
    u.ab.prototype.update = function() {
        this.a.style && (this.a.style.width = u.round(100 * this.b.Ja(), 2) + "%")
    }
    ,
    u.Xb = u.c.extend({
        i: function(a, b) {
            u.c.call(this, a, b)
        }
    }),
    u.Xb.prototype.e = function() {
        return u.c.prototype.e.call(this, "div", {
            className: "vjs-play-progress",
            innerHTML: '<span class="vjs-control-text">Progress: 0%</span>'
        })
    }
    ,
    u.gb = u.ea.extend(),
    u.gb.prototype.defaultValue = "00:00",
    u.gb.prototype.e = function() {
        return u.ea.prototype.e.call(this, "div", {
            className: "vjs-seek-handle"
        })
    }
    ,
    u.ib = u.c.extend({
        i: function(a, b) {
            u.c.call(this, a, b),
            a.h && a.h.m && a.h.m.volumeControl === l && this.n("vjs-hidden"),
            a.d("loadstart", u.bind(this, function() {
                a.h.m && a.h.m.volumeControl === l ? this.n("vjs-hidden") : this.u("vjs-hidden")
            }))
        }
    }),
    u.ib.prototype.g = {
        children: {
            volumeBar: {}
        }
    },
    u.ib.prototype.e = function() {
        return u.c.prototype.e.call(this, "div", {
            className: "vjs-volume-control vjs-control"
        })
    }
    ,
    u.hb = u.O.extend({
        i: function(a, b) {
            u.O.call(this, a, b),
            a.d("volumechange", u.bind(this, this.Ba)),
            a.L(u.bind(this, this.Ba)),
            setTimeout(u.bind(this, this.update), 0)
        }
    }),
    t = u.hb.prototype,
    t.Ba = function() {
        this.a.setAttribute("aria-valuenow", u.round(100 * this.b.volume(), 2)),
        this.a.setAttribute("aria-valuetext", u.round(100 * this.b.volume(), 2) + "%")
    }
    ,
    t.g = {
        children: {
            volumeLevel: {},
            volumeHandle: {}
        },
        barName: "volumeLevel",
        handleName: "volumeHandle"
    },
    t.tc = "volumechange",
    t.e = function() {
        return u.O.prototype.e.call(this, "div", {
            className: "vjs-volume-bar",
            "aria-label": "volume level"
        })
    }
    ,
    t.Hb = function(a) {
        this.b.muted() && this.b.muted(l),
        this.b.volume(F(this, a))
    }
    ,
    t.yb = function() {
        return this.b.muted() ? 0 : this.b.volume()
    }
    ,
    t.zc = function() {
        this.b.volume(this.b.volume() + .1)
    }
    ,
    t.yc = function() {
        this.b.volume(this.b.volume() - .1)
    }
    ,
    u.dc = u.c.extend({
        i: function(a, b) {
            u.c.call(this, a, b)
        }
    }),
    u.dc.prototype.e = function() {
        return u.c.prototype.e.call(this, "div", {
            className: "vjs-volume-level",
            innerHTML: '<span class="vjs-control-text"></span>'
        })
    }
    ,
    u.jb = u.ea.extend(),
    u.jb.prototype.defaultValue = "00:00",
    u.jb.prototype.e = function() {
        return u.ea.prototype.e.call(this, "div", {
            className: "vjs-volume-handle"
        })
    }
    ,
    u.da = u.q.extend({
        i: function(a, b) {
            u.q.call(this, a, b),
            a.d("volumechange", u.bind(this, this.update)),
            a.h && a.h.m && a.h.m.volumeControl === l && this.n("vjs-hidden"),
            a.d("loadstart", u.bind(this, function() {
                a.h.m && a.h.m.volumeControl === l ? this.n("vjs-hidden") : this.u("vjs-hidden")
            }))
        }
    }),
    u.da.prototype.e = function() {
        return u.q.prototype.e.call(this, "div", {
            className: "vjs-mute-control vjs-control",
            innerHTML: '<div><span class="vjs-control-text">Mute</span></div>'
        })
    }
    ,
    u.da.prototype.p = function() {
        this.b.muted(this.b.muted() ? l : f)
    }
    ,
    u.da.prototype.update = function() {
        var a = this.b.volume()
          , b = 3;
        for (0 === a || this.b.muted() ? b = 0 : .33 > a ? b = 1 : .67 > a && (b = 2),
        this.b.muted() ? "Unmute" != this.a.children[0].children[0].innerHTML && (this.a.children[0].children[0].innerHTML = "Unmute") : "Mute" != this.a.children[0].children[0].innerHTML && (this.a.children[0].children[0].innerHTML = "Mute"),
        a = 0; 4 > a; a++)
            u.u(this.a, "vjs-vol-" + a);
        u.n(this.a, "vjs-vol-" + b)
    }
    ,
    u.oa = u.R.extend({
        i: function(a, b) {
            u.R.call(this, a, b),
            a.d("volumechange", u.bind(this, this.update)),
            a.h && a.h.m && a.h.m.Dc === l && this.n("vjs-hidden"),
            a.d("loadstart", u.bind(this, function() {
                a.h.m && a.h.m.Dc === l ? this.n("vjs-hidden") : this.u("vjs-hidden")
            })),
            this.n("vjs-menu-button")
        }
    }),
    u.oa.prototype.Ka = function() {
        var a = new u.ma(this.b,{
            Vc: "div"
        })
          , b = new u.hb(this.b,u.k.B({
            Cd: f
        }, this.g.Vd));
        return a.Z(b),
        a
    }
    ,
    u.oa.prototype.p = function() {
        u.da.prototype.p.call(this),
        u.R.prototype.p.call(this)
    }
    ,
    u.oa.prototype.e = function() {
        return u.q.prototype.e.call(this, "div", {
            className: "vjs-volume-menu-button vjs-menu-button vjs-control",
            innerHTML: '<div><span class="vjs-control-text">Mute</span></div>'
        })
    }
    ,
    u.oa.prototype.update = u.da.prototype.update,
    u.cb = u.q.extend({
        i: function(a, b) {
            u.q.call(this, a, b),
            (!a.poster() || !a.controls()) && this.C(),
            a.d("play", u.bind(this, this.C))
        }
    }),
    u.cb.prototype.e = function() {
        var a = u.e("div", {
            className: "vjs-poster",
            tabIndex: -1
        })
          , b = this.b.poster();
        return b && ("backgroundSize"in a.style ? a.style.backgroundImage = 'url("' + b + '")' : a.appendChild(u.e("img", {
            src: b
        }))),
        a
    }
    ,
    u.cb.prototype.p = function() {
        this.K().controls() && this.b.play()
    }
    ,
    u.Wb = u.c.extend({
        i: function(a, b) {
            u.c.call(this, a, b),
            a.d("canplay", u.bind(this, this.C)),
            a.d("canplaythrough", u.bind(this, this.C)),
            a.d("playing", u.bind(this, this.C)),
            a.d("seeked", u.bind(this, this.C)),
            a.d("seeking", u.bind(this, this.show)),
            a.d("seeked", u.bind(this, this.C)),
            a.d("error", u.bind(this, this.show)),
            a.d("waiting", u.bind(this, this.show))
        }
    }),
    u.Wb.prototype.e = function() {
        return u.c.prototype.e.call(this, "div", {
            className: "vjs-loading-spinner"
        })
    }
    ,
    u.Wa = u.q.extend(),
    u.Wa.prototype.e = function() {
        return u.q.prototype.e.call(this, "div", {
            className: "vjs-big-play-button",
            innerHTML: '<span aria-hidden="true"></span>',
            "aria-label": "play video"
        })
    }
    ,
    u.Wa.prototype.p = function() {
        this.b.play()
    }
    ,
    u.r = u.c.extend({
        i: function(a, b, c) {
            u.c.call(this, a, b, c);
            var d, e;
            e = this,
            d = this.K(),
            a = function() {
                if (d.controls() && !d.Rb()) {
                    var a, b;
                    e.d("mousedown", e.p),
                    e.d("touchstart", function(a) {
                        a.preventDefault(),
                        a.stopPropagation(),
                        b = this.b.ja()
                    }),
                    a = function(a) {
                        a.stopPropagation(),
                        b && this.b.Mb()
                    }
                    ,
                    e.d("touchmove", a),
                    e.d("touchleave", a),
                    e.d("touchcancel", a),
                    e.d("touchend", a);
                    var c, g, h;
                    c = 0,
                    e.d("touchstart", function() {
                        c = (new Date).getTime(),
                        h = f
                    }),
                    a = function() {
                        h = l
                    }
                    ,
                    e.d("touchmove", a),
                    e.d("touchleave", a),
                    e.d("touchcancel", a),
                    e.d("touchend", function() {
                        h === f && (g = (new Date).getTime() - c,
                        250 > g && this.j("tap"))
                    }),
                    e.d("tap", e.md)
                }
            }
            ,
            b = u.bind(e, e.pd),
            this.L(a),
            d.d("controlsenabled", a),
            d.d("controlsdisabled", b)
        }
    }),
    u.r.prototype.pd = function() {
        this.o("tap"),
        this.o("touchstart"),
        this.o("touchmove"),
        this.o("touchleave"),
        this.o("touchcancel"),
        this.o("touchend"),
        this.o("click"),
        this.o("mousedown")
    }
    ,
    u.r.prototype.p = function(a) {
        0 === a.button && this.K().controls() && (this.K().paused() ? this.K().play() : this.K().pause())
    }
    ,
    u.r.prototype.md = function() {
        this.K().ja(!this.K().ja())
    }
    ,
    u.r.prototype.m = {
        volumeControl: f,
        fullscreenResize: l,
        progressEvents: l,
        timeupdateEvents: l
    },
    u.media = {},
    u.media.Va = "play pause paused currentTime setCurrentTime duration buffered volume setVolume muted setMuted width height supportsFullScreen enterFullScreen src load currentSrc preload setPreload autoplay setAutoplay loop setLoop error networkState readyState seeking initialTime startOffsetTime played seekable ended videoTracks audioTracks videoWidth videoHeight textTracks defaultPlaybackRate playbackRate mediaGroup controller controls defaultMuted".split(" ");
    for (var i = u.media.Va.length - 1; i >= 0; i--)
        u.r.prototype[u.media.Va[i]] = ea();
    u.l = u.r.extend({
        i: function(a, b, c) {
            if (this.m.volumeControl = u.l.Uc(),
            this.m.movingMediaElementInDOM = !u.Kc,
            this.m.fullscreenResize = f,
            u.r.call(this, a, b, c),
            (b = b.source) && this.a.currentSrc === b.src && 0 < this.a.networkState ? a.j("loadstart") : b && (this.a.src = b.src),
            u.ac && a.options().nativeControlsForTouch !== l) {
                var d, e, g, h;
                d = this,
                e = this.K(),
                b = e.controls(),
                d.a.controls = !!b,
                g = function() {
                    d.a.controls = f
                }
                ,
                h = function() {
                    d.a.controls = l
                }
                ,
                e.d("controlsenabled", g),
                e.d("controlsdisabled", h),
                b = function() {
                    e.o("controlsenabled", g),
                    e.o("controlsdisabled", h)
                }
                ,
                d.d("dispose", b),
                e.d("usingcustomcontrols", b),
                e.Rb(f)
            }
            for (a.L(function() {
                this.M && this.g.autoplay && this.paused() && (delete this.M.poster,
                this.play())
            }),
            a = u.l.$a.length - 1; a >= 0; a--)
                u.d(this.a, u.l.$a[a], u.bind(this.b, this.$c));
            this.Ua()
        }
    }),
    t = u.l.prototype,
    t.D = function() {
        u.r.prototype.D.call(this)
    }
    ,
    t.e = function() {
        var a, b = this.b, c = b.M;
        c && this.m.movingMediaElementInDOM !== l || (c ? (a = c.cloneNode(l),
        u.l.jc(c),
        c = a,
        b.M = h) : c = u.e("video", {
            id: b.id() + "_html5_api",
            className: "vjs-tech"
        }),
        c.player = b,
        u.zb(c, b.w())),
        a = ["autoplay", "preload", "loop", "muted"];
        for (var d = a.length - 1; d >= 0; d--) {
            var e = a[d];
            b.g[e] !== h && (c[e] = b.g[e])
        }
        return c
    }
    ,
    t.$c = function(a) {
        this.j(a),
        a.stopPropagation()
    }
    ,
    t.play = function() {
        this.a.play()
    }
    ,
    t.pause = function() {
        this.a.pause()
    }
    ,
    t.paused = function() {
        return this.a.paused
    }
    ,
    t.currentTime = function() {
        return this.a.currentTime
    }
    ,
    t.sd = function(a) {
        try {
            this.a.currentTime = a
        } catch (b) {
            u.log(b, "Video is not ready. (Video.js)")
        }
    }
    ,
    t.duration = function() {
        return this.a.duration || 0
    }
    ,
    t.buffered = function() {
        return this.a.buffered
    }
    ,
    t.volume = function() {
        return this.a.volume
    }
    ,
    t.xd = function(a) {
        this.a.volume = a
    }
    ,
    t.muted = function() {
        return this.a.muted
    }
    ,
    t.vd = function(a) {
        this.a.muted = a
    }
    ,
    t.width = function() {
        return this.a.offsetWidth
    }
    ,
    t.height = function() {
        return this.a.offsetHeight
    }
    ,
    t.Ta = function() {
        return "function" != typeof this.a.webkitEnterFullScreen || !/Android/.test(u.F) && /Chrome|Mac OS X 10.5/.test(u.F) ? l : f
    }
    ,
    t.src = function(a) {
        this.a.src = a
    }
    ,
    t.load = function() {
        this.a.load()
    }
    ,
    t.currentSrc = function() {
        return this.a.currentSrc
    }
    ,
    t.Qa = function() {
        return this.a.Qa
    }
    ,
    t.wd = function(a) {
        this.a.Qa = a
    }
    ,
    t.autoplay = function() {
        return this.a.autoplay
    }
    ,
    t.rd = function(a) {
        this.a.autoplay = a
    }
    ,
    t.controls = function() {
        return this.a.controls
    }
    ,
    t.loop = function() {
        return this.a.loop
    }
    ,
    t.ud = function(a) {
        this.a.loop = a
    }
    ,
    t.error = function() {
        return this.a.error
    }
    ,
    t.seeking = function() {
        return this.a.seeking
    }
    ,
    u.l.isSupported = function() {
        return !!u.na.canPlayType
    }
    ,
    u.l.mb = function(a) {
        try {
            return !!u.na.canPlayType(a.type)
        } catch (b) {
            return ""
        }
    }
    ,
    u.l.Uc = function() {
        var a = u.na.volume;
        return u.na.volume = a / 2 + .1,
        a !== u.na.volume
    }
    ,
    u.l.$a = "loadstart suspend abort error emptied stalled loadedmetadata loadeddata canplay canplaythrough playing waiting seeking seeked ended durationchange timeupdate progress play pause ratechange volumechange".split(" "),
    u.l.jc = function(a) {
        if (a) {
            for (a.player = h,
            a.parentNode && a.parentNode.removeChild(a); a.hasChildNodes(); )
                a.removeChild(a.firstChild);
            a.removeAttribute("src"),
            "function" == typeof a.load && a.load()
        }
    }
    ,
    u.Oc && (document.createElement("video").constructor.prototype.canPlayType = function(a) {
        return a && -1 != a.toLowerCase().indexOf("video/mp4") ? "maybe" : ""
    }
    ),
    u.f = u.r.extend({
        i: function(a, b, c) {
            u.r.call(this, a, b, c);
            var d = b.source;
            c = b.parentEl;
            var e = this.a = u.e("div", {
                id: a.id() + "_temp_flash"
            })
              , g = a.id() + "_flash_api";
            a = a.g;
            var h = u.k.B({
                readyFunction: "videojs.Flash.onReady",
                eventProxyFunction: "videojs.Flash.onEvent",
                errorEventProxyFunction: "videojs.Flash.onError",
                autoplay: a.autoplay,
                preload: a.Qa,
                loop: a.loop,
                muted: a.muted
            }, b.flashVars)
              , i = u.k.B({
                wmode: "opaque",
                bgcolor: "#000000"
            }, b.params)
              , j = u.k.B({
                id: g,
                name: g,
                "class": "vjs-tech"
            }, b.attributes);
            if (d && (d.type && u.f.ed(d.type) ? (a = u.f.Ac(d.src),
            h.rtmpConnection = encodeURIComponent(a.rb),
            h.rtmpStream = encodeURIComponent(a.Ob)) : h.src = encodeURIComponent(u.mc(d.src))),
            u.zb(e, c),
            b.startTime && this.L(function() {
                this.load(),
                this.play(),
                this.currentTime(b.startTime)
            }),
            b.iFrameMode !== f || u.Jc)
                u.f.Zc(b.swf, e, h, i, j);
            else {
                var k = u.e("iframe", {
                    id: g + "_iframe",
                    name: g + "_iframe",
                    className: "vjs-tech",
                    scrolling: "no",
                    marginWidth: 0,
                    marginHeight: 0,
                    frameBorder: 0
                });
                h.readyFunction = "ready",
                h.eventProxyFunction = "events",
                h.errorEventProxyFunction = "errors",
                u.d(k, "load", u.bind(this, function() {
                    var a, c = k.contentWindow;
                    a = k.contentDocument ? k.contentDocument : k.contentWindow.document,
                    a.write(u.f.nc(b.swf, h, i, j)),
                    c.player = this.b,
                    c.ready = u.bind(this.b, function(b) {
                        var c = this.h;
                        c.a = a.getElementById(b),
                        u.f.pb(c)
                    }),
                    c.events = u.bind(this.b, function(a, b) {
                        this && "flash" === this.ia && this.j(b)
                    }),
                    c.errors = u.bind(this.b, function(a, b) {
                        u.log("Flash Error", b)
                    })
                })),
                e.parentNode.replaceChild(k, e)
            }
        }
    }),
    t = u.f.prototype,
    t.D = function() {
        u.r.prototype.D.call(this)
    }
    ,
    t.play = function() {
        this.a.vjs_play()
    }
    ,
    t.pause = function() {
        this.a.vjs_pause()
    }
    ,
    t.src = function(a) {
        if (u.f.dd(a) ? (a = u.f.Ac(a),
        this.Qd(a.rb),
        this.Rd(a.Ob)) : (a = u.mc(a),
        this.a.vjs_src(a)),
        this.b.autoplay()) {
            var b = this;
            setTimeout(function() {
                b.play()
            }, 0)
        }
    }
    ,
    t.currentSrc = function() {
        var a = this.a.vjs_getProperty("currentSrc");
        if (a == h) {
            var b = this.Od()
              , c = this.Pd();
            b && c && (a = u.f.yd(b, c))
        }
        return a
    }
    ,
    t.load = function() {
        this.a.vjs_load()
    }
    ,
    t.poster = function() {
        this.a.vjs_getProperty("poster")
    }
    ,
    t.buffered = function() {
        return u.tb(0, this.a.vjs_getProperty("buffered"))
    }
    ,
    t.Ta = s(l);
    var Q = u.f.prototype, R = "rtmpConnection rtmpStream preload currentTime defaultPlaybackRate playbackRate autoplay loop mediaGroup controller controls volume muted defaultMuted".split(" "), S = "error currentSrc networkState readyState seeking initialTime duration startOffsetTime paused played seekable ended videoTracks audioTracks videoWidth videoHeight textTracks".split(" "), T;
    for (T = 0; T < R.length; T++)
        U(R[T]),
        fa();
    for (T = 0; T < S.length; T++)
        U(S[T]);
    if (u.f.isSupported = function() {
        return 10 <= u.f.version()[0]
    }
    ,
    u.f.mb = function(a) {
        return a.type ? (a = a.type.replace(/;.*/, "").toLowerCase(),
        a in u.f.bd || a in u.f.Bc ? "maybe" : void 0) : ""
    }
    ,
    u.f.bd = {
        "video/flv": "FLV",
        "video/x-flv": "FLV",
        "video/mp4": "MP4",
        "video/m4v": "MP4"
    },
    u.f.Bc = {
        "rtmp/mp4": "MP4",
        "rtmp/flv": "FLV"
    },
    u.f.onReady = function(a) {
        a = u.w(a);
        var b = a.player || a.parentNode.player
          , c = b.h;
        a.player = b,
        c.a = a,
        u.f.pb(c)
    }
    ,
    u.f.pb = function(a) {
        a.w().vjs_getProperty ? a.Ua() : setTimeout(function() {
            u.f.pb(a)
        }, 50)
    }
    ,
    u.f.onEvent = function(a, b) {
        u.w(a).player.j(b)
    }
    ,
    u.f.onError = function(a, b) {
        u.w(a).player.j("error"),
        u.log("Flash Error", b, a)
    }
    ,
    u.f.version = function() {
        var a = "0,0,0";
        try {
            a = new window.ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version").replace(/\D+/g, ",").match(/^,?(.+),?$/)[1]
        } catch (b) {
            try {
                navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin && (a = (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1])
            } catch (c) {}
        }
        return a.split(",")
    }
    ,
    u.f.Zc = function(a, b, c, d, e) {
        a = u.f.nc(a, c, d, e),
        a = u.e("div", {
            innerHTML: a
        }).childNodes[0],
        c = b.parentNode,
        b.parentNode.replaceChild(a, b);
        var f = c.childNodes[0];
        setTimeout(function() {
            f.style.display = "block"
        }, 1e3)
    }
    ,
    u.f.nc = function(a, b, c, d) {
        var e = ""
          , f = ""
          , g = "";
        return b && u.k.ua(b, function(a, b) {
            e += a + "=" + b + "&amp;"
        }),
        c = u.k.B({
            movie: a,
            flashvars: e,
            allowScriptAccess: "always",
            allowNetworking: "all"
        }, c),
        u.k.ua(c, function(a, b) {
            f += '<param name="' + a + '" value="' + b + '" />'
        }),
        d = u.k.B({
            data: a,
            width: "100%",
            height: "100%"
        }, d),
        u.k.ua(d, function(a, b) {
            g += a + '="' + b + '" '
        }),
        '<object type="application/x-shockwave-flash"' + g + ">" + f + "</object>"
    }
    ,
    u.f.yd = function(a, b) {
        return a + "&" + b
    }
    ,
    u.f.Ac = function(a) {
        var b = {
            rb: "",
            Ob: ""
        };
        if (!a)
            return b;
        var c, d = a.indexOf("&");
        return -1 !== d ? c = d + 1 : (d = c = a.lastIndexOf("/") + 1,
        0 === d && (d = c = a.length)),
        b.rb = a.substring(0, d),
        b.Ob = a.substring(c, a.length),
        b
    }
    ,
    u.f.ed = function(a) {
        return a in u.f.Bc
    }
    ,
    u.f.Qc = /^rtmp[set]?:\/\//i,
    u.f.dd = function(a) {
        return u.f.Qc.test(a)
    }
    ,
    u.Pc = u.c.extend({
        i: function(a, b, c) {
            if (u.c.call(this, a, b, c),
            a.g.sources && 0 !== a.g.sources.length)
                a.src(a.g.sources);
            else
                for (b = 0,
                c = a.g.techOrder; b < c.length; b++) {
                    var d = u.$(c[b])
                      , e = window.videojs[d];
                    if (e && e.isSupported()) {
                        I(a, d);
                        break
                    }
                }
        }
    }),
    u.X = u.c.extend({
        i: function(a, b) {
            u.c.call(this, a, b),
            this.Q = b.id || "vjs_" + b.kind + "_" + b.language + "_" + u.t++,
            this.xc = b.src,
            this.Wc = b["default"] || b.dflt,
            this.Ad = b.title,
            this.Ld = b.srclang,
            this.fd = b.label,
            this.fa = [],
            this.ec = [],
            this.ga = this.ha = 0,
            this.b.d("fullscreenchange", u.bind(this, this.Rc))
        }
    }),
    t = u.X.prototype,
    t.J = p("A"),
    t.src = p("xc"),
    t.ub = p("Wc"),
    t.title = p("Ad"),
    t.label = p("fd"),
    t.readyState = p("ha"),
    t.mode = p("ga"),
    t.Rc = function() {
        this.a.style.fontSize = this.b.H ? 140 * (screen.width / this.b.width()) + "%" : ""
    }
    ,
    t.e = function() {
        return u.c.prototype.e.call(this, "div", {
            className: "vjs-" + this.A + " vjs-text-track"
        })
    }
    ,
    t.show = function() {
        X(this),
        this.ga = 2,
        u.c.prototype.show.call(this)
    }
    ,
    t.C = function() {
        X(this),
        this.ga = 1,
        u.c.prototype.C.call(this)
    }
    ,
    t.disable = function() {
        2 == this.ga && this.C(),
        this.b.o("timeupdate", u.bind(this, this.update, this.Q)),
        this.b.o("ended", u.bind(this, this.reset, this.Q)),
        this.reset(),
        this.b.V.textTrackDisplay.removeChild(this),
        this.ga = 0
    }
    ,
    t.load = function() {
        0 === this.ha && (this.ha = 1,
        u.get(this.xc, u.bind(this, this.nd), u.bind(this, this.Gb)))
    }
    ,
    t.Gb = function(a) {
        this.error = a,
        this.ha = 3,
        this.j("error")
    }
    ,
    t.nd = function(a) {
        var b, c;
        a = a.split("\n");
        for (var d = "", e = 1, f = a.length; f > e; e++)
            if (d = u.trim(a[e])) {
                for (-1 == d.indexOf("-->") ? (b = d,
                d = u.trim(a[++e])) : b = this.fa.length,
                b = {
                    id: b,
                    index: this.fa.length
                },
                c = d.split(" --> "),
                b.startTime = Y(c[0]),
                b.va = Y(c[1]),
                c = []; a[++e] && (d = u.trim(a[e])); )
                    c.push(d);
                b.text = c.join("<br/>"),
                this.fa.push(b)
            }
        this.ha = 2,
        this.j("loaded")
    }
    ,
    t.update = function() {
        if (0 < this.fa.length) {
            var a = this.b.currentTime();
            if (this.Lb === b || a < this.Lb || this.Ma <= a) {
                var c, d, e, g, h = this.fa, i = this.b.duration(), j = 0, k = l, m = [];
                for (a >= this.Ma || this.Ma === b ? g = this.wb !== b ? this.wb : 0 : (k = f,
                g = this.Db !== b ? this.Db : h.length - 1); ; ) {
                    if (e = h[g],
                    e.va <= a)
                        j = Math.max(j, e.va),
                        e.Ia && (e.Ia = l);
                    else if (a < e.startTime) {
                        if (i = Math.min(i, e.startTime),
                        e.Ia && (e.Ia = l),
                        !k)
                            break
                    } else
                        k ? (m.splice(0, 0, e),
                        d === b && (d = g),
                        c = g) : (m.push(e),
                        c === b && (c = g),
                        d = g),
                        i = Math.min(i, e.va),
                        j = Math.max(j, e.startTime),
                        e.Ia = f;
                    if (k) {
                        if (0 === g)
                            break;
                        g--
                    } else {
                        if (g === h.length - 1)
                            break;
                        g++
                    }
                }
                for (this.ec = m,
                this.Ma = i,
                this.Lb = j,
                this.wb = c,
                this.Db = d,
                a = this.ec,
                h = "",
                i = 0,
                j = a.length; j > i; i++)
                    h += '<span class="vjs-tt-cue">' + a[i].text + "</span>";
                this.a.innerHTML = h,
                this.j("cuechange")
            }
        }
    }
    ,
    t.reset = function() {
        this.Ma = 0,
        this.Lb = this.b.duration(),
        this.Db = this.wb = 0
    }
    ,
    u.Ub = u.X.extend(),
    u.Ub.prototype.A = "captions",
    u.$b = u.X.extend(),
    u.$b.prototype.A = "subtitles",
    u.Vb = u.X.extend(),
    u.Vb.prototype.A = "chapters",
    u.bc = u.c.extend({
        i: function(a, b, c) {
            if (u.c.call(this, a, b, c),
            a.g.tracks && 0 < a.g.tracks.length) {
                b = this.b,
                a = a.g.tracks;
                var d;
                for (c = 0; c < a.length; c++) {
                    d = a[c];
                    var e = b
                      , f = d.kind
                      , g = d.label
                      , h = d.language
                      , i = d;
                    d = e.Aa = e.Aa || [],
                    i = i || {},
                    i.kind = f,
                    i.label = g,
                    i.language = h,
                    f = u.$(f || "subtitles"),
                    e = new window.videojs[f + "Track"](e,i),
                    d.push(e)
                }
            }
        }
    }),
    u.bc.prototype.e = function() {
        return u.c.prototype.e.call(this, "div", {
            className: "vjs-text-track-display"
        })
    }
    ,
    u.Y = u.N.extend({
        i: function(a, b) {
            var c = this.ca = b.track;
            b.label = c.label(),
            b.selected = c.ub(),
            u.N.call(this, a, b),
            this.b.d(c.J() + "trackchange", u.bind(this, this.update))
        }
    }),
    u.Y.prototype.p = function() {
        u.N.prototype.p.call(this),
        W(this.b, this.ca.Q, this.ca.J())
    }
    ,
    u.Y.prototype.update = function() {
        this.selected(2 == this.ca.mode())
    }
    ,
    u.bb = u.Y.extend({
        i: function(a, b) {
            b.track = {
                J: function() {
                    return b.kind
                },
                K: a,
                label: function() {
                    return b.kind + " off"
                },
                ub: s(l),
                mode: s(l)
            },
            u.Y.call(this, a, b),
            this.selected(f)
        }
    }),
    u.bb.prototype.p = function() {
        u.Y.prototype.p.call(this),
        W(this.b, this.ca.Q, this.ca.J())
    }
    ,
    u.bb.prototype.update = function() {
        for (var a, b = V(this.b), c = 0, d = b.length, e = f; d > c; c++)
            a = b[c],
            a.J() == this.ca.J() && 2 == a.mode() && (e = l);
        this.selected(e)
    }
    ,
    u.S = u.R.extend({
        i: function(a, b) {
            u.R.call(this, a, b),
            1 >= this.I.length && this.C()
        }
    }),
    u.S.prototype.ta = function() {
        var a, b = [];
        b.push(new u.bb(this.b,{
            kind: this.A
        }));
        for (var c = 0; c < V(this.b).length; c++)
            a = V(this.b)[c],
            a.J() === this.A && b.push(new u.Y(this.b,{
                track: a
            }));
        return b
    }
    ,
    u.Da = u.S.extend({
        i: function(a, b, c) {
            u.S.call(this, a, b, c),
            this.a.setAttribute("aria-label", "Captions Menu")
        }
    }),
    u.Da.prototype.A = "captions",
    u.Da.prototype.qa = "Captions",
    u.Da.prototype.className = "vjs-captions-button",
    u.Ha = u.S.extend({
        i: function(a, b, c) {
            u.S.call(this, a, b, c),
            this.a.setAttribute("aria-label", "Subtitles Menu")
        }
    }),
    u.Ha.prototype.A = "subtitles",
    u.Ha.prototype.qa = "Subtitles",
    u.Ha.prototype.className = "vjs-subtitles-button",
    u.Ea = u.S.extend({
        i: function(a, b, c) {
            u.S.call(this, a, b, c),
            this.a.setAttribute("aria-label", "Chapters Menu")
        }
    }),
    t = u.Ea.prototype,
    t.A = "chapters",
    t.qa = "Chapters",
    t.className = "vjs-chapters-button",
    t.ta = function() {
        for (var a, b = [], c = 0; c < V(this.b).length; c++)
            a = V(this.b)[c],
            a.J() === this.A && b.push(new u.Y(this.b,{
                track: a
            }));
        return b
    }
    ,
    t.Ka = function() {
        for (var a, b, c = V(this.b), d = 0, e = c.length, f = this.I = []; e > d; d++)
            if (a = c[d],
            a.J() == this.A && a.ub()) {
                if (2 > a.readyState())
                    return this.Id = a,
                    void a.d("loaded", u.bind(this, this.Ka));
                b = a;
                break
            }
        if (c = this.wa = new u.ma(this.b),
        c.a.appendChild(u.e("li", {
            className: "vjs-menu-title",
            innerHTML: u.$(this.A),
            zd: -1
        })),
        b) {
            a = b.fa;
            for (var g, d = 0, e = a.length; e > d; d++)
                g = a[d],
                g = new u.Xa(this.b,{
                    track: b,
                    cue: g
                }),
                f.push(g),
                c.Z(g)
        }
        return 0 < this.I.length && this.show(),
        c
    }
    ,
    u.Xa = u.N.extend({
        i: function(a, b) {
            var c = this.ca = b.track
              , d = this.cue = b.cue
              , e = a.currentTime();
            b.label = d.text,
            b.selected = d.startTime <= e && e < d.va,
            u.N.call(this, a, b),
            c.d("cuechange", u.bind(this, this.update))
        }
    }),
    u.Xa.prototype.p = function() {
        u.N.prototype.p.call(this),
        this.b.currentTime(this.cue.startTime),
        this.update(this.cue.startTime)
    }
    ,
    u.Xa.prototype.update = function() {
        var a = this.cue
          , b = this.b.currentTime();
        this.selected(a.startTime <= b && b < a.va)
    }
    ,
    u.k.B(u.Fa.prototype.g.children, {
        subtitlesButton: {},
        captionsButton: {},
        chaptersButton: {}
    }),
    "undefined" != typeof window.JSON && "function" === window.JSON.parse)
        u.JSON = window.JSON;
    else {
        u.JSON = {};
        var Z = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        u.JSON.parse = function(a, c) {
            function d(a, e) {
                var f, g, h = a[e];
                if (h && "object" == typeof h)
                    for (f in h)
                        Object.prototype.hasOwnProperty.call(h, f) && (g = d(h, f),
                        g !== b ? h[f] = g : delete h[f]);
                return c.call(a, e, h)
            }
            var e;
            if (a = String(a),
            Z.lastIndex = 0,
            Z.test(a) && (a = a.replace(Z, function(a) {
                return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
            })),
            /^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))
                return e = eval("(" + a + ")"),
                "function" == typeof c ? d({
                    "": e
                }, "") : e;
            throw new SyntaxError("JSON.parse(): invalid or malformed JSON data")
        }
    }
    u.fc = function() {
        var a, c, d = document.getElementsByTagName("video");
        if (d && 0 < d.length)
            for (var e = 0, f = d.length; f > e; e++) {
                if (!(c = d[e]) || !c.getAttribute) {
                    u.kb();
                    break
                }
                c.player === b && (a = c.getAttribute("data-setup"),
                a !== h && (a = u.JSON.parse(a || "{}"),
                v(c, a)))
            }
        else
            u.Ec || u.kb()
    }
    ,
    u.kb = function() {
        setTimeout(u.fc, 1)
    }
    ,
    "complete" === document.readyState ? u.Ec = f : u.U(window, "load", function() {
        u.Ec = f
    }),
    u.kb(),
    u.od = function(a, b) {
        u.s.prototype[a] = b
    }
    ;
    var ga = this;
    ga.Ed = f,
    $("videojs", u),
    $("_V_", u),
    $("videojs.options", u.options),
    $("videojs.players", u.xa),
    $("videojs.TOUCH_ENABLED", u.ac),
    $("videojs.cache", u.ra),
    $("videojs.Component", u.c),
    u.c.prototype.player = u.c.prototype.K,
    u.c.prototype.dispose = u.c.prototype.D,
    u.c.prototype.createEl = u.c.prototype.e,
    u.c.prototype.el = u.c.prototype.w,
    u.c.prototype.addChild = u.c.prototype.Z,
    u.c.prototype.children = u.c.prototype.children,
    u.c.prototype.on = u.c.prototype.d,
    u.c.prototype.off = u.c.prototype.o,
    u.c.prototype.one = u.c.prototype.U,
    u.c.prototype.trigger = u.c.prototype.j,
    u.c.prototype.triggerReady = u.c.prototype.Ua,
    u.c.prototype.show = u.c.prototype.show,
    u.c.prototype.hide = u.c.prototype.C,
    u.c.prototype.width = u.c.prototype.width,
    u.c.prototype.height = u.c.prototype.height,
    u.c.prototype.dimensions = u.c.prototype.Xc,
    u.c.prototype.ready = u.c.prototype.L,
    u.c.prototype.addClass = u.c.prototype.n,
    u.c.prototype.removeClass = u.c.prototype.u,
    $("videojs.Player", u.s),
    u.s.prototype.dispose = u.s.prototype.D,
    u.s.prototype.requestFullScreen = u.s.prototype.ya,
    u.s.prototype.cancelFullScreen = u.s.prototype.ob,
    u.s.prototype.bufferedPercent = u.s.prototype.Ja,
    u.s.prototype.usingNativeControls = u.s.prototype.Rb,
    u.s.prototype.reportUserActivity = u.s.prototype.Mb,
    u.s.prototype.userActive = u.s.prototype.ja,
    $("videojs.MediaLoader", u.Pc),
    $("videojs.TextTrackDisplay", u.bc),
    $("videojs.ControlBar", u.Fa),
    $("videojs.Button", u.q),
    $("videojs.PlayToggle", u.Yb),
    $("videojs.FullscreenToggle", u.Ga),
    $("videojs.BigPlayButton", u.Wa),
    $("videojs.LoadingSpinner", u.Wb),
    $("videojs.CurrentTimeDisplay", u.Ya),
    $("videojs.DurationDisplay", u.Za),
    $("videojs.TimeDivider", u.cc),
    $("videojs.RemainingTimeDisplay", u.fb),
    $("videojs.Slider", u.O),
    $("videojs.ProgressControl", u.eb),
    $("videojs.SeekBar", u.Zb),
    $("videojs.LoadProgressBar", u.ab),
    $("videojs.PlayProgressBar", u.Xb),
    $("videojs.SeekHandle", u.gb),
    $("videojs.VolumeControl", u.ib),
    $("videojs.VolumeBar", u.hb),
    $("videojs.VolumeLevel", u.dc),
    $("videojs.VolumeMenuButton", u.oa),
    $("videojs.VolumeHandle", u.jb),
    $("videojs.MuteToggle", u.da),
    $("videojs.PosterImage", u.cb),
    $("videojs.Menu", u.ma),
    $("videojs.MenuItem", u.N),
    $("videojs.MenuButton", u.R),
    u.R.prototype.createItems = u.R.prototype.ta,
    u.S.prototype.createItems = u.S.prototype.ta,
    u.Ea.prototype.createItems = u.Ea.prototype.ta,
    $("videojs.SubtitlesButton", u.Ha),
    $("videojs.CaptionsButton", u.Da),
    $("videojs.ChaptersButton", u.Ea),
    $("videojs.MediaTechController", u.r),
    u.r.prototype.features = u.r.prototype.m,
    u.r.prototype.m.volumeControl = u.r.prototype.m.Dc,
    u.r.prototype.m.fullscreenResize = u.r.prototype.m.Jd,
    u.r.prototype.m.progressEvents = u.r.prototype.m.Nd,
    u.r.prototype.m.timeupdateEvents = u.r.prototype.m.Sd,
    $("videojs.Html5", u.l),
    u.l.Events = u.l.$a,
    u.l.isSupported = u.l.isSupported,
    u.l.canPlaySource = u.l.mb,
    u.l.prototype.setCurrentTime = u.l.prototype.sd,
    u.l.prototype.setVolume = u.l.prototype.xd,
    u.l.prototype.setMuted = u.l.prototype.vd,
    u.l.prototype.setPreload = u.l.prototype.wd,
    u.l.prototype.setAutoplay = u.l.prototype.rd,
    u.l.prototype.setLoop = u.l.prototype.ud,
    $("videojs.Flash", u.f),
    u.f.isSupported = u.f.isSupported,
    u.f.canPlaySource = u.f.mb,
    u.f.onReady = u.f.onReady,
    $("videojs.TextTrack", u.X),
    u.X.prototype.label = u.X.prototype.label,
    $("videojs.CaptionsTrack", u.Ub),
    $("videojs.SubtitlesTrack", u.$b),
    $("videojs.ChaptersTrack", u.Vb),
    $("videojs.autoSetup", u.fc),
    $("videojs.plugin", u.od),
    $("videojs.createTimeRange", u.tb)
}();
var libFuncName = null ;
if ("undefined" == typeof jQuery && "undefined" == typeof Zepto && "function" == typeof $)
    libFuncName = $;
else if ("function" == typeof jQuery)
    libFuncName = jQuery;
else {
    if ("function" != typeof Zepto)
        throw new TypeError;
    libFuncName = Zepto
}
!function(a, b, c, d) {
    "use strict";
    a("head").append('<meta class="foundation-mq-small">'),
    a("head").append('<meta class="foundation-mq-medium">'),
    a("head").append('<meta class="foundation-mq-large">'),
    b.matchMedia = b.matchMedia || function(a) {
        var b, c = a.documentElement, d = c.firstElementChild || c.firstChild, e = a.createElement("body"), f = a.createElement("div");
        return f.id = "mq-test-1",
        f.style.cssText = "position:absolute;top:-100em",
        e.style.background = "none",
        e.appendChild(f),
        function(a) {
            return f.innerHTML = '&shy;<style media="' + a + '"> #mq-test-1 { width: 42px; }</style>',
            c.insertBefore(e, d),
            b = 42 === f.offsetWidth,
            c.removeChild(e),
            {
                matches: b,
                media: a
            }
        }
    }(c),
    Array.prototype.filter || (Array.prototype.filter = function(a) {
        if (null == this)
            throw new TypeError;
        var b = Object(this)
          , c = b.length >>> 0;
        if ("function" == typeof a) {
            for (var d = [], e = arguments[1], f = 0; c > f; f++)
                if (f in b) {
                    var g = b[f];
                    a && a.call(e, g, f, b) && d.push(g)
                }
            return d
        }
    }
    ),
    Function.prototype.bind || (Function.prototype.bind = function(a) {
        if ("function" != typeof this)
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        var b = Array.prototype.slice.call(arguments, 1)
          , c = this
          , d = function() {}
          , e = function() {
            return c.apply(this instanceof d && a ? this : a, b.concat(Array.prototype.slice.call(arguments)))
        }
        ;
        return d.prototype = this.prototype,
        e.prototype = new d,
        e
    }
    ),
    Array.prototype.indexOf || (Array.prototype.indexOf = function(a) {
        if (null == this)
            throw new TypeError;
        var b = Object(this)
          , c = b.length >>> 0;
        if (0 === c)
            return -1;
        var d = 0;
        if (arguments.length > 1 && (d = Number(arguments[1]),
        d != d ? d = 0 : 0 != d && 1 / 0 != d && d != -1 / 0 && (d = (d > 0 || -1) * Math.floor(Math.abs(d)))),
        d >= c)
            return -1;
        for (var e = d >= 0 ? d : Math.max(c - Math.abs(d), 0); c > e; e++)
            if (e in b && b[e] === a)
                return e;
        return -1
    }
    ),
    a.fn.stop = a.fn.stop || function() {
        return this
    }
    ,
    b.Foundation = {
        name: "Foundation",
        version: "4.3.2",
        cache: {},
        media_queries: {
            small: a(".foundation-mq-small").css("font-family").replace(/\'/g, ""),
            medium: a(".foundation-mq-medium").css("font-family").replace(/\'/g, ""),
            large: a(".foundation-mq-large").css("font-family").replace(/\'/g, "")
        },
        stylesheet: a("<style></style>").appendTo("head")[0].sheet,
        init: function(b, c, d, e, f, g) {
            var h, i = [b, d, e, f], j = [], g = g || !1;
            if (g && (this.nc = g),
            this.rtl = /rtl/i.test(a("html").attr("dir")),
            this.scope = b || this.scope,
            c && "string" == typeof c && !/reflow/i.test(c)) {
                if (/off/i.test(c))
                    return this.off();
                if (h = c.split(" "),
                h.length > 0)
                    for (var k = h.length - 1; k >= 0; k--)
                        j.push(this.init_lib(h[k], i))
            } else {
                /reflow/i.test(c) && (i[1] = "reflow");
                for (var l in this.libs)
                    j.push(this.init_lib(l, i))
            }
            return "function" == typeof c && i.unshift(c),
            this.response_obj(j, i)
        },
        response_obj: function(a, b) {
            for (var c = 0, d = b.length; d > c; c++)
                if ("function" == typeof b[c])
                    return b[c]({
                        errors: a.filter(function(a) {
                            return "string" == typeof a ? a : void 0
                        })
                    });
            return a
        },
        init_lib: function(a, b) {
            return this.trap(function() {
                return this.libs.hasOwnProperty(a) ? (this.patch(this.libs[a]),
                this.libs[a].init.apply(this.libs[a], b)) : function() {}
            }
            .bind(this), a)
        },
        trap: function(a, b) {
            if (!this.nc)
                try {
                    return a()
                } catch (c) {
                    return this.error({
                        name: b,
                        message: "could not be initialized",
                        more: c.name + " " + c.message
                    })
                }
            return a()
        },
        patch: function(a) {
            this.fix_outer(a),
            a.scope = this.scope,
            a.rtl = this.rtl
        },
        inherit: function(a, b) {
            for (var c = b.split(" "), d = c.length - 1; d >= 0; d--)
                this.lib_methods.hasOwnProperty(c[d]) && (this.libs[a.name][c[d]] = this.lib_methods[c[d]])
        },
        random_str: function(a) {
            var b = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
            a || (a = Math.floor(Math.random() * b.length));
            for (var c = "", d = 0; a > d; d++)
                c += b[Math.floor(Math.random() * b.length)];
            return c
        },
        libs: {},
        lib_methods: {
            set_data: function(a, b) {
                var c = [this.name, +new Date, Foundation.random_str(5)].join("-");
                return Foundation.cache[c] = b,
                a.attr("data-" + this.name + "-id", c),
                b
            },
            get_data: function(a) {
                return Foundation.cache[a.attr("data-" + this.name + "-id")]
            },
            remove_data: function(b) {
                b ? (delete Foundation.cache[b.attr("data-" + this.name + "-id")],
                b.attr("data-" + this.name + "-id", "")) : a("[data-" + this.name + "-id]").each(function() {
                    delete Foundation.cache[a(this).attr("data-" + this.name + "-id")],
                    a(this).attr("data-" + this.name + "-id", "")
                })
            },
            throttle: function(a, b) {
                var c = null ;
                return function() {
                    var d = this
                      , e = arguments;
                    clearTimeout(c),
                    c = setTimeout(function() {
                        a.apply(d, e)
                    }, b)
                }
            },
            data_options: function(b) {
                function c(a) {
                    return !isNaN(a - 0) && null !== a && "" !== a && a !== !1 && a !== !0
                }
                function d(b) {
                    return "string" == typeof b ? a.trim(b) : b
                }
                var e, f, g = {}, h = (b.attr("data-options") || ":").split(";"), i = h.length;
                for (e = i - 1; e >= 0; e--)
                    f = h[e].split(":"),
                    /true/i.test(f[1]) && (f[1] = !0),
                    /false/i.test(f[1]) && (f[1] = !1),
                    c(f[1]) && (f[1] = parseInt(f[1], 10)),
                    2 === f.length && f[0].length > 0 && (g[d(f[0])] = d(f[1]));
                return g
            },
            delay: function(a, b) {
                return setTimeout(a, b)
            },
            scrollTo: function(c, d, e) {
                if (!(0 > e)) {
                    var f = d - a(b).scrollTop()
                      , g = f / e * 10;
                    this.scrollToTimerCache = setTimeout(function() {
                        isNaN(parseInt(g, 10)) || (b.scrollTo(0, a(b).scrollTop() + g),
                        this.scrollTo(c, d, e - 10))
                    }
                    .bind(this), 10)
                }
            },
            scrollLeft: function(a) {
                return a.length ? "scrollLeft"in a[0] ? a[0].scrollLeft : a[0].pageXOffset : void 0
            },
            empty: function(a) {
                if (a.length && a.length > 0)
                    return !1;
                if (a.length && 0 === a.length)
                    return !0;
                for (var b in a)
                    if (hasOwnProperty.call(a, b))
                        return !1;
                return !0
            },
            addCustomRule: function(a, b) {
                if (b === d)
                    Foundation.stylesheet.insertRule(a, Foundation.stylesheet.cssRules.length);
                else {
                    var c = Foundation.media_queries[b];
                    c !== d && Foundation.stylesheet.insertRule("@media " + Foundation.media_queries[b] + "{ " + a + " }")
                }
            }
        },
        fix_outer: function(a) {
            a.outerHeight = function(a, b) {
                return "function" == typeof Zepto ? a.height() : "undefined" != typeof b ? a.outerHeight(b) : a.outerHeight()
            }
            ,
            a.outerWidth = function(a, b) {
                return "function" == typeof Zepto ? a.width() : "undefined" != typeof b ? a.outerWidth(b) : a.outerWidth()
            }
        },
        error: function(a) {
            return a.name + " " + a.message + "; " + a.more
        },
        off: function() {
            return a(this.scope).off(".fndtn"),
            a(b).off(".fndtn"),
            !0
        },
        zj: a
    },
    a.fn.foundation = function() {
        var a = Array.prototype.slice.call(arguments, 0);
        return this.each(function() {
            return Foundation.init.apply(Foundation, [this].concat(a)),
            this
        })
    }
}(libFuncName, this, this.document),
function(a, b, c, d) {
    "use strict";
    Foundation.libs.reveal = {
        name: "reveal",
        version: "4.3.2",
        locked: !1,
        settings: {
            animation: "fadeAndPop",
            animationSpeed: 250,
            closeOnBackgroundClick: !0,
            closeOnEsc: !0,
            dismissModalClass: "close-reveal-modal",
            bgClass: "reveal-modal-bg",
            open: function() {},
            opened: function() {},
            close: function() {},
            closed: function() {},
            bg: a(".reveal-modal-bg"),
            css: {
                open: {
                    opacity: 0,
                    visibility: "visible",
                    display: "block"
                },
                close: {
                    opacity: 1,
                    visibility: "hidden",
                    display: "none"
                }
            }
        },
        init: function(b, c, d) {
            return Foundation.inherit(this, "data_options delay"),
            "object" == typeof c ? a.extend(!0, this.settings, c) : "undefined" != typeof d && a.extend(!0, this.settings, d),
            "string" != typeof c ? (this.events(),
            this.settings.init) : this[c].call(this, d)
        },
        events: function() {
            var b = this;
            return a(this.scope).off(".fndtn.reveal").on("click.fndtn.reveal", "[data-reveal-id]", function(c) {
                if (c.preventDefault(),
                !b.locked) {
                    var d = a(this)
                      , e = d.data("reveal-ajax");
                    if (b.locked = !0,
                    "undefined" == typeof e)
                        b.open.call(b, d);
                    else {
                        var f = e === !0 ? d.attr("href") : e;
                        b.open.call(b, d, {
                            url: f
                        })
                    }
                }
            }).on("click.fndtn.reveal touchend", this.close_targets(), function(c) {
                if (c.preventDefault(),
                !b.locked) {
                    var d = a.extend({}, b.settings, b.data_options(a(".reveal-modal.open")))
                      , e = a(c.target)[0] === a("." + d.bgClass)[0];
                    if (e && !d.closeOnBackgroundClick)
                        return;
                    b.locked = !0,
                    b.close.call(b, e ? a(".reveal-modal.open") : a(this).closest(".reveal-modal"))
                }
            }),
            a(this.scope).hasClass("reveal-modal") ? a(this.scope).on("open.fndtn.reveal", this.settings.open).on("opened.fndtn.reveal", this.settings.opened).on("opened.fndtn.reveal", this.open_video).on("close.fndtn.reveal", this.settings.close).on("closed.fndtn.reveal", this.settings.closed).on("closed.fndtn.reveal", this.close_video) : a(this.scope).on("open.fndtn.reveal", ".reveal-modal", this.settings.open).on("opened.fndtn.reveal", ".reveal-modal", this.settings.opened).on("opened.fndtn.reveal", ".reveal-modal", this.open_video).on("close.fndtn.reveal", ".reveal-modal", this.settings.close).on("closed.fndtn.reveal", ".reveal-modal", this.settings.closed).on("closed.fndtn.reveal", ".reveal-modal", this.close_video),
            a("body").bind("keyup.reveal", function(c) {
                var d = a(".reveal-modal.open")
                  , e = a.extend({}, b.settings, b.data_options(d));
                27 === c.which && e.closeOnEsc && d.foundation("reveal", "close")
            }),
            !0
        },
        open: function(b, c) {
            if (b)
                if ("undefined" != typeof b.selector)
                    var d = a("#" + b.data("reveal-id"));
                else {
                    var d = a(this.scope);
                    c = b
                }
            else
                var d = a(this.scope);
            if (!d.hasClass("open")) {
                var e = a(".reveal-modal.open");
                if ("undefined" == typeof d.data("css-top") && d.data("css-top", parseInt(d.css("top"), 10)).data("offset", this.cache_offset(d)),
                d.trigger("open"),
                e.length < 1 && this.toggle_bg(),
                "undefined" != typeof c && c.url) {
                    var f = this
                      , g = "undefined" != typeof c.success ? c.success : null ;
                    a.extend(c, {
                        success: function(b, c, h) {
                            a.isFunction(g) && g(b, c, h),
                            d.html(b),
                            a(d).foundation("section", "reflow"),
                            f.hide(e, f.settings.css.close),
                            f.show(d, f.settings.css.open)
                        }
                    }),
                    a.ajax(c)
                } else
                    this.hide(e, this.settings.css.close),
                    this.show(d, this.settings.css.open)
            }
        },
        close: function(b) {
            var b = b && b.length ? b : a(this.scope)
              , c = a(".reveal-modal.open");
            c.length > 0 && (this.locked = !0,
            b.trigger("close"),
            this.toggle_bg(),
            this.hide(c, this.settings.css.close))
        },
        close_targets: function() {
            var a = "." + this.settings.dismissModalClass;
            return this.settings.closeOnBackgroundClick ? a + ", ." + this.settings.bgClass : a
        },
        toggle_bg: function() {
            0 === a("." + this.settings.bgClass).length && (this.settings.bg = a("<div />", {
                "class": this.settings.bgClass
            }).appendTo("body")),
            this.settings.bg.filter(":visible").length > 0 ? this.hide(this.settings.bg) : this.show(this.settings.bg)
        },
        show: function(c, d) {
            if (d) {
                if (0 === c.parent("body").length) {
                    var e = c.wrap('<div style="display: none;" />').parent();
                    c.on("closed.fndtn.reveal.wrapped", function() {
                        c.detach().appendTo(e),
                        c.unwrap().unbind("closed.fndtn.reveal.wrapped")
                    }),
                    c.detach().appendTo("body")
                }
                if (/pop/i.test(this.settings.animation)) {
                    d.top = a(b).scrollTop() - c.data("offset") + "px";
                    var f = {
                        top: a(b).scrollTop() + c.data("css-top") + "px",
                        opacity: 1
                    };
                    return this.delay(function() {
                        return c.css(d).animate(f, this.settings.animationSpeed, "linear", function() {
                            this.locked = !1,
                            c.trigger("opened")
                        }
                        .bind(this)).addClass("open")
                    }
                    .bind(this), this.settings.animationSpeed / 2)
                }
                if (/fade/i.test(this.settings.animation)) {
                    var f = {
                        opacity: 1
                    };
                    return this.delay(function() {
                        return c.css(d).animate(f, this.settings.animationSpeed, "linear", function() {
                            this.locked = !1,
                            c.trigger("opened")
                        }
                        .bind(this)).addClass("open")
                    }
                    .bind(this), this.settings.animationSpeed / 2)
                }
                return c.css(d).show().css({
                    opacity: 1
                }).addClass("open").trigger("opened")
            }
            return /fade/i.test(this.settings.animation) ? c.fadeIn(this.settings.animationSpeed / 2) : c.show()
        },
        hide: function(c, d) {
            if (d) {
                if (/pop/i.test(this.settings.animation)) {
                    var e = {
                        top: -a(b).scrollTop() - c.data("offset") + "px",
                        opacity: 0
                    };
                    return this.delay(function() {
                        return c.animate(e, this.settings.animationSpeed, "linear", function() {
                            this.locked = !1,
                            c.css(d).trigger("closed")
                        }
                        .bind(this)).removeClass("open")
                    }
                    .bind(this), this.settings.animationSpeed / 2)
                }
                if (/fade/i.test(this.settings.animation)) {
                    var e = {
                        opacity: 0
                    };
                    return this.delay(function() {
                        return c.animate(e, this.settings.animationSpeed, "linear", function() {
                            this.locked = !1,
                            c.css(d).trigger("closed")
                        }
                        .bind(this)).removeClass("open")
                    }
                    .bind(this), this.settings.animationSpeed / 2)
                }
                return c.hide().css(d).removeClass("open").trigger("closed")
            }
            return /fade/i.test(this.settings.animation) ? c.fadeOut(this.settings.animationSpeed / 2) : c.hide()
        },
        close_video: function() {
            var b = a(this).find(".flex-video")
              , c = b.find("iframe");
            c.length > 0 && (c.attr("data-src", c[0].src),
            c.attr("src", "about:blank"),
            b.hide())
        },
        open_video: function() {
            var b = a(this).find(".flex-video")
              , c = b.find("iframe");
            if (c.length > 0) {
                var e = c.attr("data-src");
                if ("string" == typeof e)
                    c[0].src = c.attr("data-src");
                else {
                    var f = c[0].src;
                    c[0].src = d,
                    c[0].src = f
                }
                b.show()
            }
        },
        cache_offset: function(a) {
            var b = a.show().height() + parseInt(a.css("top"), 10);
            return a.hide(),
            b
        },
        off: function() {
            a(this.scope).off(".fndtn.reveal")
        },
        reflow: function() {}
    }
}(Foundation.zj, this, this.document),
function(a, b) {
    "use strict";
    Foundation.libs.tooltips = {
        name: "tooltips",
        version: "4.3.2",
        settings: {
            selector: ".has-tip",
            additionalInheritableClasses: [],
            tooltipClass: ".tooltip",
            touchCloseText: "tap to close",
            appendTo: "body",
            "disable-for-touch": !1,
            tipTemplate: function(a, b) {
                return '<span data-selector="' + a + '" class="' + Foundation.libs.tooltips.settings.tooltipClass.substring(1) + '">' + b + '<span class="nub"></span></span>'
            }
        },
        cache: {},
        init: function(b, c, d) {
            Foundation.inherit(this, "data_options");
            var e = this;
            return "object" == typeof c ? a.extend(!0, this.settings, c) : "undefined" != typeof d && a.extend(!0, this.settings, d),
            "string" == typeof c ? this[c].call(this, d) : void (Modernizr.touch ? a(this.scope).on("click.fndtn.tooltip touchstart.fndtn.tooltip touchend.fndtn.tooltip", "[data-tooltip]", function(b) {
                var c = a.extend({}, e.settings, e.data_options(a(this)));
                c["disable-for-touch"] || (b.preventDefault(),
                a(c.tooltipClass).hide(),
                e.showOrCreateTip(a(this)))
            }).on("click.fndtn.tooltip touchstart.fndtn.tooltip touchend.fndtn.tooltip", this.settings.tooltipClass, function(b) {
                b.preventDefault(),
                a(this).fadeOut(150)
            }) : a(this.scope).on("mouseenter.fndtn.tooltip mouseleave.fndtn.tooltip", "[data-tooltip]", function(b) {
                var c = a(this);
                /enter|over/i.test(b.type) ? e.showOrCreateTip(c) : ("mouseout" === b.type || "mouseleave" === b.type) && e.hide(c)
            }))
        },
        showOrCreateTip: function(a) {
            var b = this.getTip(a);
            return b && b.length > 0 ? this.show(a) : this.create(a)
        },
        getTip: function(b) {
            var c = this.selector(b)
              , d = null ;
            return c && (d = a('span[data-selector="' + c + '"]' + this.settings.tooltipClass)),
            "object" == typeof d ? d : !1
        },
        selector: function(a) {
            var b = a.attr("id")
              , c = a.attr("data-tooltip") || a.attr("data-selector");
            return (b && b.length < 1 || !b) && "string" != typeof c && (c = "tooltip" + Math.random().toString(36).substring(7),
            a.attr("data-selector", c)),
            b && b.length > 0 ? b : c
        },
        create: function(b) {
            var c = a(this.settings.tipTemplate(this.selector(b), a("<div></div>").html(b.attr("title")).html()))
              , d = this.inheritable_classes(b);
            c.addClass(d).appendTo(this.settings.appendTo),
            Modernizr.touch && c.append('<span class="tap-to-close">' + this.settings.touchCloseText + "</span>"),
            b.removeAttr("title").attr("title", ""),
            this.show(b)
        },
        reposition: function(c, d, e) {
            var f, g, h, i, j;
            if (d.css("visibility", "hidden").show(),
            f = c.data("width"),
            g = d.children(".nub"),
            h = this.outerHeight(g),
            i = this.outerHeight(g),
            j = function(a, b, c, d, e, f) {
                return a.css({
                    top: b ? b : "auto",
                    bottom: d ? d : "auto",
                    left: e ? e : "auto",
                    right: c ? c : "auto",
                    width: f ? f : "auto"
                }).end()
            }
            ,
            j(d, c.offset().top + this.outerHeight(c) + 10, "auto", "auto", c.offset().left, f),
            a(b).width() < 767)
                j(d, c.offset().top + this.outerHeight(c) + 10, "auto", "auto", 12.5, a(this.scope).width()),
                d.addClass("tip-override"),
                j(g, -h, "auto", "auto", c.offset().left);
            else {
                var k = c.offset().left;
                Foundation.rtl && (k = c.offset().left + c.offset().width - this.outerWidth(d)),
                j(d, c.offset().top + this.outerHeight(c) + 10, "auto", "auto", k, f),
                d.removeClass("tip-override"),
                e && e.indexOf("tip-top") > -1 ? j(d, c.offset().top - this.outerHeight(d), "auto", "auto", k, f).removeClass("tip-override") : e && e.indexOf("tip-left") > -1 ? j(d, c.offset().top + this.outerHeight(c) / 2 - 2.5 * h, "auto", "auto", c.offset().left - this.outerWidth(d) - h, f).removeClass("tip-override") : e && e.indexOf("tip-right") > -1 && j(d, c.offset().top + this.outerHeight(c) / 2 - 2.5 * h, "auto", "auto", c.offset().left + this.outerWidth(c) + h, f).removeClass("tip-override")
            }
            d.css("visibility", "visible").hide()
        },
        inheritable_classes: function(b) {
            var c = ["tip-top", "tip-left", "tip-bottom", "tip-right", "noradius"].concat(this.settings.additionalInheritableClasses)
              , d = b.attr("class")
              , e = d ? a.map(d.split(" "), function(b) {
                return -1 !== a.inArray(b, c) ? b : void 0
            }).join(" ") : "";
            return a.trim(e)
        },
        show: function(a) {
            var b = this.getTip(a);
            this.reposition(a, b, a.attr("class")),
            b.fadeIn(150)
        },
        hide: function(a) {
            var b = this.getTip(a);
            b.fadeOut(150)
        },
        reload: function() {
            var b = a(this);
            return b.data("fndtn-tooltips") ? b.foundationTooltips("destroy").foundationTooltips("init") : b.foundationTooltips("init")
        },
        off: function() {
            a(this.scope).off(".fndtn.tooltip"),
            a(this.settings.tooltipClass).each(function(b) {
                a("[data-tooltip]").get(b).attr("title", a(this).text())
            }).remove()
        },
        reflow: function() {}
    }
}(Foundation.zj, this, this.document);
