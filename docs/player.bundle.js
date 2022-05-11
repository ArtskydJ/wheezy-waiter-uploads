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
  var src_url_equal_anchor;
  function src_url_equal(element_src, url) {
    if (!src_url_equal_anchor) {
      src_url_equal_anchor = document.createElement("a");
    }
    src_url_equal_anchor.href = url;
    return element_src === src_url_equal_anchor.href;
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
  function set_style(node, key, value, important) {
    if (value === null) {
      node.style.removeProperty(key);
    } else {
      node.style.setProperty(key, value, important ? "important" : "");
    }
  }
  var crossorigin;
  function is_crossorigin() {
    if (crossorigin === void 0) {
      crossorigin = false;
      try {
        if (typeof window !== "undefined" && window.parent) {
          void window.parent.document;
        }
      } catch (error) {
        crossorigin = true;
      }
    }
    return crossorigin;
  }
  function add_resize_listener(node, fn) {
    const computed_style = getComputedStyle(node);
    if (computed_style.position === "static") {
      node.style.position = "relative";
    }
    const iframe = element("iframe");
    iframe.setAttribute("style", "display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;");
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    const crossorigin2 = is_crossorigin();
    let unsubscribe;
    if (crossorigin2) {
      iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>";
      unsubscribe = listen(window, "message", (event) => {
        if (event.source === iframe.contentWindow)
          fn();
      });
    } else {
      iframe.src = "about:blank";
      iframe.onload = () => {
        unsubscribe = listen(iframe.contentWindow, "resize", fn);
      };
    }
    append(node, iframe);
    return () => {
      if (crossorigin2) {
        unsubscribe();
      } else if (unsubscribe && iframe.contentWindow) {
        unsubscribe();
      }
      detach(iframe);
    };
  }
  var current_component;
  function set_current_component(component) {
    current_component = component;
  }
  function get_current_component() {
    if (!current_component)
      throw new Error("Function called outside component initialization");
    return current_component;
  }
  function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
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
  var outros;
  function group_outros() {
    outros = {
      r: 0,
      c: [],
      p: outros
    };
  }
  function check_outros() {
    if (!outros.r) {
      run_all(outros.c);
    }
    outros = outros.p;
  }
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  function transition_out(block, local, detach2, callback) {
    if (block && block.o) {
      if (outroing.has(block))
        return;
      outroing.add(block);
      outros.c.push(() => {
        outroing.delete(block);
        if (callback) {
          if (detach2)
            block.d(1);
          callback();
        }
      });
      block.o(local);
    }
  }
  var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
  function outro_and_destroy_block(block, lookup) {
    transition_out(block, 1, 1, () => {
      lookup.delete(block.key);
    });
  }
  function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block2, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
      old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = /* @__PURE__ */ new Map();
    const deltas = /* @__PURE__ */ new Map();
    i = n;
    while (i--) {
      const child_ctx = get_context(ctx, list, i);
      const key = get_key(child_ctx);
      let block = lookup.get(key);
      if (!block) {
        block = create_each_block2(key, child_ctx);
        block.c();
      } else if (dynamic) {
        block.p(child_ctx, dirty);
      }
      new_lookup.set(key, new_blocks[i] = block);
      if (key in old_indexes)
        deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = /* @__PURE__ */ new Set();
    const did_move = /* @__PURE__ */ new Set();
    function insert2(block) {
      transition_in(block, 1);
      block.m(node, next);
      lookup.set(block.key, block);
      next = block.first;
      n--;
    }
    while (o && n) {
      const new_block = new_blocks[n - 1];
      const old_block = old_blocks[o - 1];
      const new_key = new_block.key;
      const old_key = old_block.key;
      if (new_block === old_block) {
        next = new_block.first;
        o--;
        n--;
      } else if (!new_lookup.has(old_key)) {
        destroy(old_block, lookup);
        o--;
      } else if (!lookup.has(new_key) || will_move.has(new_key)) {
        insert2(new_block);
      } else if (did_move.has(old_key)) {
        o--;
      } else if (deltas.get(new_key) > deltas.get(old_key)) {
        did_move.add(new_key);
        insert2(new_block);
      } else {
        will_move.add(old_key);
        o--;
      }
    }
    while (o--) {
      const old_block = old_blocks[o];
      if (!new_lookup.has(old_block.key))
        destroy(old_block, lookup);
    }
    while (n)
      insert2(new_blocks[n - 1]);
    return new_blocks;
  }
  function create_component(block) {
    block && block.c();
  }
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
  function init(component, options, instance7, create_fragment7, not_equal, props, append_styles, dirty = [-1]) {
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
    $$.ctx = instance7 ? instance7(component, options.props || {}, (i, ret, ...rest) => {
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
    $$.fragment = create_fragment7 ? create_fragment7($$.ctx) : false;
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

  // player/Date.svelte
  function create_fragment(ctx) {
    let span;
    let t_value = fmt_date(ctx[0]) + "";
    let t;
    let span_title_value;
    return {
      c() {
        span = element("span");
        t = text(t_value);
        attr(span, "title", span_title_value = fmt_time(ctx[0]));
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t);
      },
      p(ctx2, [dirty]) {
        if (dirty & 1 && t_value !== (t_value = fmt_date(ctx2[0]) + ""))
          set_data(t, t_value);
        if (dirty & 1 && span_title_value !== (span_title_value = fmt_time(ctx2[0]))) {
          attr(span, "title", span_title_value);
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(span);
      }
    };
  }
  function fmt_time(d) {
    return fmt_date(d) + " " + d.toLocaleTimeString();
  }
  function fmt_date(d) {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }
  function instance($$self, $$props, $$invalidate) {
    let date;
    let { isoDate } = $$props;
    $$self.$$set = ($$props2) => {
      if ("isoDate" in $$props2)
        $$invalidate(1, isoDate = $$props2.isoDate);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & 2) {
        $:
          $$invalidate(0, date = new Date(isoDate));
      }
    };
    return [date, isoDate];
  }
  var Date_1 = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment, safe_not_equal, { isoDate: 1 });
    }
  };
  var Date_default = Date_1;

  // player/SidebarItem.svelte
  function create_fragment2(ctx) {
    let a;
    let img;
    let img_data_src_value;
    let t0;
    let div1;
    let t1_value = ctx[2].title + "";
    let t1;
    let t2;
    let div0;
    let date;
    let a_href_value;
    let current;
    date = new Date_default({
      props: { isoDate: ctx[2].publishedAt }
    });
    return {
      c() {
        a = element("a");
        img = element("img");
        t0 = space();
        div1 = element("div");
        t1 = text(t1_value);
        t2 = space();
        div0 = element("div");
        create_component(date.$$.fragment);
        attr(img, "class", "lozad");
        attr(img, "data-src", img_data_src_value = ctx[2].thumbnails.default.url);
        attr(img, "width", ctx[4]);
        attr(img, "height", ctx[3]);
        attr(img, "alt", "thumbnail");
        attr(div0, "class", "small svelte-1u872v7");
        attr(div1, "class", "text svelte-1u872v7");
        attr(a, "class", "item svelte-1u872v7");
        attr(a, "title", ctx[0]);
        attr(a, "href", a_href_value = "#" + ctx[2].resourceId.videoId);
        attr(a, "data-selected", ctx[1]);
      },
      m(target, anchor) {
        insert(target, a, anchor);
        append(a, img);
        append(a, t0);
        append(a, div1);
        append(div1, t1);
        append(div1, t2);
        append(div1, div0);
        mount_component(date, div0, null);
        current = true;
      },
      p(ctx2, [dirty]) {
        if (!current || dirty & 4 && img_data_src_value !== (img_data_src_value = ctx2[2].thumbnails.default.url)) {
          attr(img, "data-src", img_data_src_value);
        }
        if (!current || dirty & 16) {
          attr(img, "width", ctx2[4]);
        }
        if (!current || dirty & 8) {
          attr(img, "height", ctx2[3]);
        }
        if ((!current || dirty & 4) && t1_value !== (t1_value = ctx2[2].title + ""))
          set_data(t1, t1_value);
        const date_changes = {};
        if (dirty & 4)
          date_changes.isoDate = ctx2[2].publishedAt;
        date.$set(date_changes);
        if (!current || dirty & 1) {
          attr(a, "title", ctx2[0]);
        }
        if (!current || dirty & 4 && a_href_value !== (a_href_value = "#" + ctx2[2].resourceId.videoId)) {
          attr(a, "href", a_href_value);
        }
        if (!current || dirty & 2) {
          attr(a, "data-selected", ctx2[1]);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(date.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(date.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(a);
        destroy_component(date);
      }
    };
  }
  var sizeMultiplier = 0.6;
  function instance2($$self, $$props, $$invalidate) {
    let width;
    let height;
    let { hoverText } = $$props;
    let { isSelected } = $$props;
    let { snippet } = $$props;
    onMount(() => {
      if (isSelected) {
        document.querySelector('.item[data-selected="true"]').scrollIntoView();
      }
    });
    $$self.$$set = ($$props2) => {
      if ("hoverText" in $$props2)
        $$invalidate(0, hoverText = $$props2.hoverText);
      if ("isSelected" in $$props2)
        $$invalidate(1, isSelected = $$props2.isSelected);
      if ("snippet" in $$props2)
        $$invalidate(2, snippet = $$props2.snippet);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & 4) {
        $:
          $$invalidate(4, width = snippet.thumbnails.default.width * sizeMultiplier);
      }
      if ($$self.$$.dirty & 4) {
        $:
          $$invalidate(3, height = snippet.thumbnails.default.height * sizeMultiplier);
      }
    };
    return [hoverText, isSelected, snippet, height, width];
  }
  var SidebarItem = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance2, create_fragment2, safe_not_equal, { hoverText: 0, isSelected: 1, snippet: 2 });
    }
  };
  var SidebarItem_default = SidebarItem;

  // player/Sidebar.svelte
  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[2] = list[i].snippet;
    child_ctx[3] = list[i].etag;
    child_ctx[5] = i;
    return child_ctx;
  }
  function create_each_block(key_1, ctx) {
    let first;
    let sidebaritem;
    let current;
    sidebaritem = new SidebarItem_default({
      props: {
        hoverText: ctx[5] + 1 + " of " + ctx[0].length,
        isSelected: ctx[2].resourceId.videoId === ctx[1],
        snippet: ctx[2]
      }
    });
    return {
      key: key_1,
      first: null,
      c() {
        first = empty();
        create_component(sidebaritem.$$.fragment);
        this.first = first;
      },
      m(target, anchor) {
        insert(target, first, anchor);
        mount_component(sidebaritem, target, anchor);
        current = true;
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        const sidebaritem_changes = {};
        if (dirty & 1)
          sidebaritem_changes.hoverText = ctx[5] + 1 + " of " + ctx[0].length;
        if (dirty & 3)
          sidebaritem_changes.isSelected = ctx[2].resourceId.videoId === ctx[1];
        if (dirty & 1)
          sidebaritem_changes.snippet = ctx[2];
        sidebaritem.$set(sidebaritem_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(sidebaritem.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(sidebaritem.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(first);
        destroy_component(sidebaritem, detaching);
      }
    };
  }
  function create_fragment3(ctx) {
    let div;
    let each_blocks = [];
    let each_1_lookup = /* @__PURE__ */ new Map();
    let current;
    let each_value = ctx[0];
    const get_key = (ctx2) => ctx2[2].resourceId.videoId;
    for (let i = 0; i < each_value.length; i += 1) {
      let child_ctx = get_each_context(ctx, each_value, i);
      let key = get_key(child_ctx);
      each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    }
    return {
      c() {
        div = element("div");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        attr(div, "class", "hideoverflow svelte-1njextn");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div, null);
        }
        current = true;
      },
      p(ctx2, [dirty]) {
        if (dirty & 3) {
          each_value = ctx2[0];
          group_outros();
          each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block, null, get_each_context);
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        current = true;
      },
      o(local) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div);
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].d();
        }
      }
    };
  }
  function instance3($$self, $$props, $$invalidate) {
    let { videos } = $$props;
    let { currentVideoId } = $$props;
    $$self.$$set = ($$props2) => {
      if ("videos" in $$props2)
        $$invalidate(0, videos = $$props2.videos);
      if ("currentVideoId" in $$props2)
        $$invalidate(1, currentVideoId = $$props2.currentVideoId);
    };
    return [videos, currentVideoId];
  }
  var Sidebar = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance3, create_fragment3, safe_not_equal, { videos: 0, currentVideoId: 1 });
    }
  };
  var Sidebar_default = Sidebar;

  // player/Video.svelte
  function create_fragment4(ctx) {
    let iframe;
    let iframe_src_value;
    return {
      c() {
        iframe = element("iframe");
        attr(iframe, "title", "youtube");
        iframe.allowFullscreen = "allowFullScreen";
        if (!src_url_equal(iframe.src, iframe_src_value = ctx[2]))
          attr(iframe, "src", iframe_src_value);
        attr(iframe, "width", ctx[0]);
        attr(iframe, "height", ctx[1]);
        attr(iframe, "allowtransparency", "true");
        attr(iframe, "frameborder", "0");
      },
      m(target, anchor) {
        insert(target, iframe, anchor);
      },
      p(ctx2, [dirty]) {
        if (dirty & 4 && !src_url_equal(iframe.src, iframe_src_value = ctx2[2])) {
          attr(iframe, "src", iframe_src_value);
        }
        if (dirty & 1) {
          attr(iframe, "width", ctx2[0]);
        }
        if (dirty & 2) {
          attr(iframe, "height", ctx2[1]);
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(iframe);
      }
    };
  }
  function instance4($$self, $$props, $$invalidate) {
    let src;
    let { snippet } = $$props;
    let { width } = $$props;
    let { height } = $$props;
    let { autoplay = false } = $$props;
    $$self.$$set = ($$props2) => {
      if ("snippet" in $$props2)
        $$invalidate(3, snippet = $$props2.snippet);
      if ("width" in $$props2)
        $$invalidate(0, width = $$props2.width);
      if ("height" in $$props2)
        $$invalidate(1, height = $$props2.height);
      if ("autoplay" in $$props2)
        $$invalidate(4, autoplay = $$props2.autoplay);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & 24) {
        $:
          $$invalidate(2, src = `https://www.youtube.com/embed/${snippet.resourceId.videoId}?ecver=1&autoplay=${autoplay ? 1 : 0}&iv_load_policy=1&yt:stretch=16:9&autohide=1&color=red&width=1280&height=720`);
      }
    };
    return [width, height, src, snippet, autoplay];
  }
  var Video = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance4, create_fragment4, safe_not_equal, {
        snippet: 3,
        width: 0,
        height: 1,
        autoplay: 4
      });
    }
  };
  var Video_default = Video;

  // player/Description.svelte
  function create_fragment5(ctx) {
    let div;
    let date;
    let t0;
    let hr;
    let t1;
    let article;
    let raw_value = linkify(ctx[0].description) + "";
    let current;
    date = new Date_default({
      props: { isoDate: ctx[0].publishedAt }
    });
    return {
      c() {
        div = element("div");
        create_component(date.$$.fragment);
        t0 = space();
        hr = element("hr");
        t1 = space();
        article = element("article");
        attr(hr, "class", "svelte-dkxruu");
        attr(article, "class", "svelte-dkxruu");
        attr(div, "class", "meta svelte-dkxruu");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        mount_component(date, div, null);
        append(div, t0);
        append(div, hr);
        append(div, t1);
        append(div, article);
        article.innerHTML = raw_value;
        current = true;
      },
      p(ctx2, [dirty]) {
        const date_changes = {};
        if (dirty & 1)
          date_changes.isoDate = ctx2[0].publishedAt;
        date.$set(date_changes);
        if ((!current || dirty & 1) && raw_value !== (raw_value = linkify(ctx2[0].description) + ""))
          article.innerHTML = raw_value;
        ;
      },
      i(local) {
        if (current)
          return;
        transition_in(date.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(date.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div);
        destroy_component(date);
      }
    };
  }
  function linkify(text2) {
    return text2.replace(/(https?:\/\/[^ \n]+)/g, '<a href="$1" title="$1">$1</a>');
  }
  function instance5($$self, $$props, $$invalidate) {
    let { snippet } = $$props;
    $$self.$$set = ($$props2) => {
      if ("snippet" in $$props2)
        $$invalidate(0, snippet = $$props2.snippet);
    };
    return [snippet];
  }
  var Description = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance5, create_fragment5, safe_not_equal, { snippet: 0 });
    }
  };
  var Description_default = Description;

  // player/Player.svelte
  function create_else_block(ctx) {
    let div2;
    let div0;
    let video;
    let t0;
    let description;
    let div0_resize_listener;
    let t1;
    let div1;
    let sidebar;
    let current;
    video = new Video_default({
      props: {
        snippet: ctx[3],
        width: ctx[1],
        height: ctx[4],
        autoplay: true
      }
    });
    description = new Description_default({ props: { snippet: ctx[3] } });
    sidebar = new Sidebar_default({
      props: {
        videos: ctx[2],
        currentVideoId: ctx[3].resourceId.videoId
      }
    });
    return {
      c() {
        div2 = element("div");
        div0 = element("div");
        create_component(video.$$.fragment);
        t0 = space();
        create_component(description.$$.fragment);
        t1 = space();
        div1 = element("div");
        create_component(sidebar.$$.fragment);
        attr(div0, "class", "left svelte-114633p");
        add_render_callback(() => ctx[5].call(div0));
        attr(div1, "class", "right svelte-114633p");
        attr(div2, "class", "split svelte-114633p");
      },
      m(target, anchor) {
        insert(target, div2, anchor);
        append(div2, div0);
        mount_component(video, div0, null);
        append(div0, t0);
        mount_component(description, div0, null);
        div0_resize_listener = add_resize_listener(div0, ctx[5].bind(div0));
        append(div2, t1);
        append(div2, div1);
        mount_component(sidebar, div1, null);
        current = true;
      },
      p(ctx2, dirty) {
        const video_changes = {};
        if (dirty & 8)
          video_changes.snippet = ctx2[3];
        if (dirty & 2)
          video_changes.width = ctx2[1];
        if (dirty & 16)
          video_changes.height = ctx2[4];
        video.$set(video_changes);
        const description_changes = {};
        if (dirty & 8)
          description_changes.snippet = ctx2[3];
        description.$set(description_changes);
        const sidebar_changes = {};
        if (dirty & 4)
          sidebar_changes.videos = ctx2[2];
        if (dirty & 8)
          sidebar_changes.currentVideoId = ctx2[3].resourceId.videoId;
        sidebar.$set(sidebar_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(video.$$.fragment, local);
        transition_in(description.$$.fragment, local);
        transition_in(sidebar.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(video.$$.fragment, local);
        transition_out(description.$$.fragment, local);
        transition_out(sidebar.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div2);
        destroy_component(video);
        destroy_component(description);
        div0_resize_listener();
        destroy_component(sidebar);
      }
    };
  }
  function create_if_block(ctx) {
    let p;
    return {
      c() {
        p = element("p");
        p.textContent = "Loading...";
        set_style(p, "text-align", "center");
      },
      m(target, anchor) {
        insert(target, p, anchor);
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(p);
      }
    };
  }
  function create_fragment6(ctx) {
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [create_if_block, create_else_block];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (!ctx2[3])
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx, -1);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    return {
      c() {
        if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2, dirty);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if_blocks[current_block_type_index].d(detaching);
        if (detaching)
          detach(if_block_anchor);
      }
    };
  }
  var localStorageKey = "videos";
  function instance6($$self, $$props, $$invalidate) {
    let width;
    let height;
    let videos = [];
    let snippet;
    const uploadsJson = localStorage.getItem(localStorageKey);
    if (uploadsJson) {
      videos = JSON.parse(uploadsJson);
      loadVideoFromHash();
    } else {
      console.log("Fetching video list");
      fetch("./player.json").then((response) => response.text()).then((json) => {
        $$invalidate(2, videos = JSON.parse(json));
        loadVideoFromHash();
        localStorage.setItem(localStorageKey, json);
      });
    }
    function loadVideoFromHash() {
      const videoId = document.location.hash.replace("#", "");
      const video = videos.find((v) => v.snippet.resourceId.videoId === videoId) || videos[0];
      $$invalidate(3, snippet = video.snippet);
      document.title = snippet.title;
    }
    let windowWidth;
    window.addEventListener("hashchange", loadVideoFromHash);
    function div0_elementresize_handler() {
      windowWidth = this.clientWidth;
      $$invalidate(0, windowWidth);
    }
    $$self.$$.update = () => {
      if ($$self.$$.dirty & 1) {
        $:
          $$invalidate(1, width = Math.min(windowWidth, 1280));
      }
      if ($$self.$$.dirty & 2) {
        $:
          $$invalidate(4, height = Math.floor(width * 9 / 16));
      }
    };
    return [windowWidth, width, videos, snippet, height, div0_elementresize_handler];
  }
  var Player = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance6, create_fragment6, safe_not_equal, {});
    }
  };
  var Player_default = Player;

  // player/player.js
  new Player_default({
    target: document.body
  });
  window.lozad().observe();
})();
