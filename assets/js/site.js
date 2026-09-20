(() => {
  "use strict";

  const menu = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  function closeMenu() {
    sidebar.classList.remove("is-open");
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "展开导航");
  }
  menu?.addEventListener("click", () => {
    const open = sidebar.classList.toggle("is-open");
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "收起导航" : "展开导航");
    if (open) sidebar.querySelector("a").focus();
  });
  document.addEventListener("keydown", (event) => {
    const editing =
      /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) ||
      event.target.isContentEditable;
    if (
      event.key === "/" &&
      !editing &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey
    ) {
      event.preventDefault();
      document.querySelector("#global-search")?.focus();
    }
    if (event.key === "Escape" && sidebar?.classList.contains("is-open")) {
      closeMenu();
      menu.focus();
    }
  });
  window.matchMedia("(max-width: 760px)").addEventListener("change", closeMenu);

  const library = document.querySelector("[data-library]");
  if (library) {
    const input = library.querySelector("#library-search");
    const rows = [...library.querySelectorAll("[data-document]")];
    const buttons = [...library.querySelectorAll("[data-filter]")];
    const clear = library.querySelector(".clear-search");
    let topic = "all";
    const normalize = (value) =>
      value.normalize("NFKC").toLocaleLowerCase().trim();
    const indexedRows = rows.map((row) => ({
      row,
      text: normalize(row.dataset.search),
    }));

    function render(updateURL = true) {
      const query = input.value.trim();
      const terms = normalize(query).split(/\s+/).filter(Boolean);
      let count = 0;
      indexedRows.forEach(({ row, text }) => {
        const matches =
          (topic === "all" || row.dataset.topic === topic) &&
          terms.every((term) => text.includes(term));
        row.hidden = !matches;
        if (matches) count++;
      });
      buttons.forEach((button) => {
        const selected = button.dataset.filter === topic;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      document.querySelectorAll("[data-topic-link]").forEach((link) => {
        const active = link.dataset.topicLink === topic;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
      const selected = buttons.find(
        (button) => button.dataset.filter === topic,
      );
      library.querySelector("[data-library-title]").textContent =
        topic === "all" ? "全部文档" : selected.firstChild.textContent.trim();
      library.querySelector("[data-results-count]").textContent =
        `${count} 篇文档${query ? " · 搜索结果" : ""}`;
      library.querySelector(".empty-state").hidden = count > 0;
      clear.hidden = !query;
      if (updateURL) {
        const url = new URL(window.location.href);
        query ? url.searchParams.set("q", query) : url.searchParams.delete("q");
        topic === "all"
          ? url.searchParams.delete("topic")
          : url.searchParams.set("topic", topic);
        window.history.replaceState(null, "", url);
      }
    }
    function readURL() {
      const params = new URLSearchParams(window.location.search);
      input.value = params.get("q") || "";
      const requested = params.get("topic");
      topic = buttons.some((button) => button.dataset.filter === requested)
        ? requested
        : "all";
      render(false);
    }
    buttons.forEach((button) =>
      button.addEventListener("click", () => {
        topic = button.dataset.filter;
        render();
      }),
    );
    input.addEventListener("input", () => render());
    library.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      render();
    });
    clear.addEventListener("click", () => {
      input.value = "";
      render();
      input.focus();
    });
    library
      .querySelector("[data-reset-filters]")
      .addEventListener("click", () => {
        input.value = "";
        topic = "all";
        render();
        input.focus();
      });
    window.addEventListener("popstate", readURL);
    readURL();
  }

  const content = document.querySelector("[data-post-content]");
  if (content) {
    content.querySelectorAll("table").forEach((table) => {
      const wrapper = document.createElement("div");
      wrapper.className = "table-scroll";
      wrapper.tabIndex = 0;
      wrapper.setAttribute("role", "region");
      wrapper.setAttribute("aria-label", "数据表格，可横向滚动");
      table.before(wrapper);
      wrapper.append(table);
    });
    const headings = [...content.querySelectorAll("h1, h2, h3")].filter(
      (heading) => heading.textContent.trim(),
    );
    const toc = document.querySelector("[data-toc]");
    if (headings.length && toc) {
      document.querySelector(".toc-panel").hidden = false;
      headings.forEach((heading, index) => {
        if (!heading.id) {
          let id = `section-${index + 1}`;
          while (document.getElementById(id)) id += "-section";
          heading.id = id;
        }
        const link = document.createElement("a");
        link.href = `#${encodeURIComponent(heading.id)}`;
        link.textContent = heading.textContent;
        link.dataset.level = heading.tagName.slice(1);
        toc.append(link);
      });
      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            const visible = entries.find((entry) => entry.isIntersecting);
            if (!visible) return;
            toc
              .querySelectorAll("a")
              .forEach((link) =>
                link.classList.toggle(
                  "is-active",
                  decodeURIComponent(link.hash.slice(1)) === visible.target.id,
                ),
              );
          },
          { rootMargin: "0px 0px -70% 0px" },
        );
        headings.forEach((heading) => observer.observe(heading));
      }
    }
  }
})();
