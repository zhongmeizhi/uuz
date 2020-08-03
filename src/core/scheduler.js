const queue = [];

const p = Promise.resolve();
let isFlushPending = false;

function nextTick(fn) {
  return fn ? p.then(fn) : p;
}

function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job);
    // 执行所有的 job
    queueFlush();
  }
}

function queueFlush() {
  if (isFlushPending) return;
  isFlushPending = true;
  nextTick(flushJobs);
}

function flushJobs() {
  isFlushPending = false;
  let job;
  while ((job = queue.shift())) {
    if (job) {
      job();
    }
  }
}

export {
  nextTick,
  queueJob
}
