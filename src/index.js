let targetMap = new WeakMap();
let activeEffect;

function update(el, instance) {
  el.innerHTML = instance.render()
}

function effect(fn, options = {}) {
  const _effect = function(...args) {
    activeEffect = _effect;
    return fn(...args);
  };
  /* computed相关 */
  if (!options.lazy) {
    _effect();
  }
  _effect.options = options;
  return _effect;
}

function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
		targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
	if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
	}
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const effects = new Set()
  depsMap.get(key).forEach(e => effects.add(e))
  effects.forEach(e => scheduleRun(e))
}


function scheduleRun(effect) {
  if (effect.options.scheduler !== void 0) {
    effect.options.scheduler();
  } else {
    effect();
  }
}

function mount(instance, el) {
  effect(function() {
    instance.$data && update(el, instance);
  })
  instance.$data = instance.setup();
  update(el, instance);
}

function reactive(target) {
  return new Proxy(target, {
    get(target, prop) {
      track(target, prop);
      return Reflect.get(target, prop);
    },
    set(target, prop, newVal) {
      Reflect.set(target, prop, newVal);
      trigger(target, prop);
      /* 
        必须 return true;
        否则会产生警告 'set' on proxy: trap returned falsish for property
      */
      return true;
    }
  })
}

function ref(target) {
  let value = target

  const obj = {
    get value() {
      track(obj, 'value');
      return value;
    },
    set value(newVal) {
      if (newVal !== value) {
        value = newVal;
        trigger(obj, 'value');
      }
    }
  }

  return obj;
}

function computed(fn) {
  let dirty = true;
  let value;

  const runner = effect(fn, {
    lazy: true,
    scheduler: () => {
      dirty = true;
    }
  });
  return {
    get value() {
      if (dirty) {
        dirty = false;
        value = runner();
      }
      return value;
    }
  };
}


export {
  mount,
  reactive,
  ref,
  computed
}