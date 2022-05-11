(() => {
  // node_modules/svelte/internal/index.mjs
  function noop() {
  }
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return /* @__PURE__ */ Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function is_function(thing) {
    return typeof thing === "function";
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  var is_hydrating = false;
  function start_hydrating() {
    is_hydrating = true;
  }
  function end_hydrating() {
    is_hydrating = false;
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    node.parentNode.removeChild(node);
  }
  function element(name) {
    return document.createElement(name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
  }
  function empty() {
    return text("");
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function prevent_default(fn) {
    return function(event) {
      event.preventDefault();
      return fn.call(this, event);
    };
  }
  function attr(node, attribute, value) {
    if (value == null)
      node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value);
  }
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  function set_data(text2, data) {
    data = "" + data;
    if (text2.wholeText !== data)
      text2.data = data;
  }
  function set_input_value(input, value) {
    input.value = value == null ? "" : value;
  }
  var current_component;
  function set_current_component(component) {
    current_component = component;
  }
  var dirty_components = [];
  var binding_callbacks = [];
  var render_callbacks = [];
  var flush_callbacks = [];
  var resolved_promise = Promise.resolve();
  var update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  var seen_callbacks = /* @__PURE__ */ new Set();
  var flushidx = 0;
  function flush() {
    const saved_component = current_component;
    do {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length)
        binding_callbacks.pop()();
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      const dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }
  var outroing = /* @__PURE__ */ new Set();
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
  function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
      add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
          on_destroy.push(...new_on_destroy);
        } else {
          run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
      });
    }
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
  }
  function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
      fragment: null,
      ctx: null,
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
      const value = rest.length ? rest[0] : ret;
      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if (!$$.skip_bound && $$.bound[i])
          $$.bound[i](value);
        if (ready)
          make_dirty(component, i);
      }
      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        start_hydrating();
        const nodes = children(options.target);
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        $$.fragment && $$.fragment.c();
      }
      if (options.intro)
        transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor, options.customElement);
      end_hydrating();
      flush();
    }
    set_current_component(parent_component);
  }
  var SvelteElement;
  if (typeof HTMLElement === "function") {
    SvelteElement = class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
      }
      connectedCallback() {
        const { on_mount } = this.$$;
        this.$$.on_disconnect = on_mount.map(run).filter(is_function);
        for (const key in this.$$.slotted) {
          this.appendChild(this.$$.slotted[key]);
        }
      }
      attributeChangedCallback(attr2, _oldValue, newValue) {
        this[attr2] = newValue;
      }
      disconnectedCallback() {
        run_all(this.$$.on_disconnect);
      }
      $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
      }
      $on(type, callback) {
        const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
        callbacks.push(callback);
        return () => {
          const index = callbacks.indexOf(callback);
          if (index !== -1)
            callbacks.splice(index, 1);
        };
      }
      $set($$props) {
        if (this.$$set && !is_empty($$props)) {
          this.$$.skip_bound = true;
          this.$$set($$props);
          this.$$.skip_bound = false;
        }
      }
    };
  }
  var SvelteComponent = class {
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  };

  // youtube-playlist-puller/YoutubePlaylistPuller.svelte
  function create_if_block_2(ctx) {
    let p;
    let t;
    return {
      c() {
        p = element("p");
        t = text(ctx[4]);
      },
      m(target, anchor) {
        insert(target, p, anchor);
        append(p, t);
      },
      p(ctx2, dirty) {
        if (dirty & 16)
          set_data(t, ctx2[4]);
      },
      d(detaching) {
        if (detaching)
          detach(p);
      }
    };
  }
  function create_if_block(ctx) {
    let p;
    let t0;
    let t1_value = ctx[2].length + "";
    let t1;
    let t2;
    let t3;
    let if_block_anchor;
    let if_block = ctx[3] && create_if_block_1(ctx);
    return {
      c() {
        p = element("p");
        t0 = text("Pulled ");
        t1 = text(t1_value);
        t2 = text(" videos");
        t3 = space();
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        insert(target, p, anchor);
        append(p, t0);
        append(p, t1);
        append(p, t2);
        insert(target, t3, anchor);
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & 4 && t1_value !== (t1_value = ctx2[2].length + ""))
          set_data(t1, t1_value);
        if (ctx2[3]) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block_1(ctx2);
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      d(detaching) {
        if (detaching)
          detach(p);
        if (detaching)
          detach(t3);
        if (if_block)
          if_block.d(detaching);
        if (detaching)
          detach(if_block_anchor);
      }
    };
  }
  function create_if_block_1(ctx) {
    let a;
    let t;
    let a_href_value;
    let a_download_value;
    return {
      c() {
        a = element("a");
        t = text("Download JSON");
        attr(a, "href", a_href_value = "data:text/plain;charset=utf-8," + encodeURIComponent(ctx[3]));
        attr(a, "download", a_download_value = "uploads-" + ctx[1] + ".json");
      },
      m(target, anchor) {
        insert(target, a, anchor);
        append(a, t);
      },
      p(ctx2, dirty) {
        if (dirty & 8 && a_href_value !== (a_href_value = "data:text/plain;charset=utf-8," + encodeURIComponent(ctx2[3]))) {
          attr(a, "href", a_href_value);
        }
        if (dirty & 2 && a_download_value !== (a_download_value = "uploads-" + ctx2[1] + ".json")) {
          attr(a, "download", a_download_value);
        }
      },
      d(detaching) {
        if (detaching)
          detach(a);
      }
    };
  }
  function create_fragment(ctx) {
    let form;
    let div0;
    let label0;
    let t1;
    let input0;
    let t2;
    let div1;
    let label1;
    let t4;
    let input1;
    let t5;
    let div2;
    let t7;
    let t8;
    let if_block1_anchor;
    let mounted;
    let dispose;
    let if_block0 = ctx[4] && create_if_block_2(ctx);
    let if_block1 = ctx[2] && create_if_block(ctx);
    return {
      c() {
        form = element("form");
        div0 = element("div");
        label0 = element("label");
        label0.textContent = "API key";
        t1 = space();
        input0 = element("input");
        t2 = space();
        div1 = element("div");
        label1 = element("label");
        label1.textContent = "Channel ID";
        t4 = space();
        input1 = element("input");
        t5 = space();
        div2 = element("div");
        div2.innerHTML = `<button>Go</button>`;
        t7 = space();
        if (if_block0)
          if_block0.c();
        t8 = space();
        if (if_block1)
          if_block1.c();
        if_block1_anchor = empty();
        attr(label0, "for", "apiKey");
        attr(label0, "class", "svelte-1bk08fv");
        attr(input0, "id", "apiKey");
        attr(input0, "type", "text");
        attr(input0, "placeholder", "FaKe_7sXWg42vs_unYlUvVpUrBTwSyYeN9_fAkE");
        attr(input0, "class", "svelte-1bk08fv");
        attr(div0, "class", "cell");
        attr(label1, "for", "channelId");
        attr(label1, "class", "svelte-1bk08fv");
        attr(input1, "id", "channelId");
        attr(input1, "type", "text");
        attr(input1, "placeholder", "UCQL5ABUvwY7YoW5lgMyAS_w");
        attr(input1, "class", "svelte-1bk08fv");
        attr(div1, "class", "cell");
        attr(div2, "class", "cell");
        attr(form, "class", "row svelte-1bk08fv");
      },
      m(target, anchor) {
        insert(target, form, anchor);
        append(form, div0);
        append(div0, label0);
        append(div0, t1);
        append(div0, input0);
        set_input_value(input0, ctx[0]);
        append(form, t2);
        append(form, div1);
        append(div1, label1);
        append(div1, t4);
        append(div1, input1);
        set_input_value(input1, ctx[1]);
        append(form, t5);
        append(form, div2);
        insert(target, t7, anchor);
        if (if_block0)
          if_block0.m(target, anchor);
        insert(target, t8, anchor);
        if (if_block1)
          if_block1.m(target, anchor);
        insert(target, if_block1_anchor, anchor);
        if (!mounted) {
          dispose = [
            listen(input0, "input", ctx[6]),
            listen(input1, "input", ctx[7]),
            listen(form, "submit", prevent_default(ctx[5]))
          ];
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (dirty & 1 && input0.value !== ctx2[0]) {
          set_input_value(input0, ctx2[0]);
        }
        if (dirty & 2 && input1.value !== ctx2[1]) {
          set_input_value(input1, ctx2[1]);
        }
        if (ctx2[4]) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_2(ctx2);
            if_block0.c();
            if_block0.m(t8.parentNode, t8);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (ctx2[2]) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block(ctx2);
            if_block1.c();
            if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(form);
        if (detaching)
          detach(t7);
        if (if_block0)
          if_block0.d(detaching);
        if (detaching)
          detach(t8);
        if (if_block1)
          if_block1.d(detaching);
        if (detaching)
          detach(if_block1_anchor);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function uploadsPlaylistFromChannelId(channelId) {
    if (!channelId.startsWith("UC")) {
      throw new Error("Invalid channel ID");
    }
    return "UU" + channelId.slice(2);
  }
  function customStringify(arr) {
    return `[
	${arr.map((e) => JSON.stringify(e)).join(",\n	")}
]`;
  }
  function instance($$self, $$props, $$invalidate) {
    let apiKey = "";
    let channelId = "UCQL5ABUvwY7YoW5lgMyAS_w";
    let videos = null;
    let prettyJson = "";
    let errorMessage = null;
    function ytFetch(path, query) {
      const prefix = "https://youtube.googleapis.com/youtube/v3/";
      const queryString = new URLSearchParams({ ...query, key: apiKey }).toString();
      const url = `${prefix}${path}?${queryString}`;
      return fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" }
      });
    }
    async function ytFetchEntirePlaylist(playlistId) {
      const maxResults = 50;
      let pageToken = null;
      $$invalidate(2, videos = []);
      while (true) {
        const result = await ytFetch("playlistItems", {
          part: "snippet,id",
          maxResults,
          playlistId,
          ...pageToken ? { pageToken } : {}
        });
        if (result.ok) {
          console.log(result);
          const { kind, etag, nextPageToken, items, pageInfo } = await result.json();
          $$invalidate(2, videos = [...items.reverse(), ...videos]);
          pageToken = nextPageToken;
          if (items.length < maxResults) {
            break;
          }
        } else {
          throw new Error((await result.json()).error.message);
        }
      }
    }
    async function go() {
      if (apiKey && channelId) {
        const playlistId = uploadsPlaylistFromChannelId(channelId);
        try {
          await ytFetchEntirePlaylist(playlistId);
        } catch (e) {
          $$invalidate(4, errorMessage = e.message);
        }
        $$invalidate(3, prettyJson = customStringify(videos));
      }
    }
    function input0_input_handler() {
      apiKey = this.value;
      $$invalidate(0, apiKey);
    }
    function input1_input_handler() {
      channelId = this.value;
      $$invalidate(1, channelId);
    }
    return [
      apiKey,
      channelId,
      videos,
      prettyJson,
      errorMessage,
      go,
      input0_input_handler,
      input1_input_handler
    ];
  }
  var YoutubePlaylistPuller = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment, safe_not_equal, {});
    }
  };
  var YoutubePlaylistPuller_default = YoutubePlaylistPuller;

  // youtube-playlist-puller/youtube-playlist-puller.js
  new YoutubePlaylistPuller_default({
    target: document.body
  });
})();
