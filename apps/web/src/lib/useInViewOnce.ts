'use client';

import { RefObject, useEffect, useState } from 'react';

/**
 * "Has this element entered the viewport — at least once?" hook.
 *
 * ── Why not a plain IntersectionObserver ────────────────────────────────
 * An IntersectionObserver dispatches a callback when an element's
 * intersection *ratio* crosses a threshold. An element sitting below the
 * fold has ratio 0; if the page is then jumped past it — an in-page anchor,
 * a restored scroll position, a browser find, a programmatic `scrollTo` —
 * the element ends up above the fold with the ratio still 0. The ratio
 * never changed, so the observer stays silent and the element is never
 * reported as visible.
 *
 * So two mechanisms run together:
 *   1. a shared IntersectionObserver for the normal, smooth-scroll case;
 *   2. a shared passive scroll/resize listener that measures the element's
 *      rect and reports it once its top has passed the viewport edge.
 *
 * Both are singletons — one observer and one listener for the whole page.
 * An element is dropped from the pending set as soon as it is reported, so
 * the cost falls off as the page is consumed.
 */

type Pending = {
  el: Element;
  release: () => void;
};

const pending = new Set<Pending>();

let observer: IntersectionObserver | null = null;
let scrollListener: (() => void) | null = null;

/** Report anything whose top edge has reached or passed the viewport. */
function sweep() {
  if (pending.size === 0) {
    teardown();
    return;
  }

  for (const item of Array.from(pending)) {
    const rect = item.el.getBoundingClientRect();
    // `top <= innerHeight` covers both "now on screen" and "scrolled past".
    if (rect.top <= window.innerHeight) {
      pending.delete(item);
      item.release();
    }
  }
}

function teardown() {
  observer?.disconnect();
  observer = null;

  if (scrollListener) {
    window.removeEventListener('scroll', scrollListener);
    window.removeEventListener('resize', scrollListener);
    scrollListener = null;
  }
}

function register(el: Element, release: () => void) {
  const item: Pending = { el, release };
  pending.add(item);

  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const candidate of Array.from(pending)) {
            if (candidate.el === entry.target) {
              pending.delete(candidate);
              candidate.release();
            }
          }
        }
      },
      // Zero threshold: the only workable ratio for a block taller than the
      // window, and the cheapest thing to observe.
      { threshold: 0, rootMargin: '0px 0px -40px 0px' },
    );

    scrollListener = sweep;
    window.addEventListener('scroll', scrollListener, { passive: true });
    window.addEventListener('resize', scrollListener);
  }

  observer.observe(el);
  sweep();
}

function unregister(el: Element) {
  for (const item of Array.from(pending)) {
    if (item.el === el) pending.delete(item);
  }
}

/**
 * @param ref   the element to watch
 * @param rootMargin  extra viewport margin, e.g. '0px 0px -40px 0px'
 * @returns true once the element has been in view
 */
export default function useInViewOnce<T extends Element>(
  ref: RefObject<T | null>,
  rootMargin = '0px 0px -40px 0px',
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No observer support (or a prerender) — treat it as visible rather
    // than hiding it forever.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    register(node, () => setInView(true));

    return () => unregister(node);
    // `rootMargin` is not part of the effect: the shared observer is created
    // once with the default margin, and changing it would mean rebuilding
    // the singleton for every consumer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return inView;
}
