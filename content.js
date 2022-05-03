function filterHiddenElements(nodeList) {
    return Array.from(nodeList).filter(v=>v.style.display !== "none" && !["hidden", "collapse"].includes(v.style.visibility));
}

function getContextMenuElement() {
    // there are many divs that match the css selector, but only one will be visible.
    const contextMenus = filterHiddenElements(document.querySelectorAll(".goog-menu.goog-menu-vertical.apps-menu-hide-mnemonics"));
    // return only the visible ones
    return contextMenus.length > 0 ? contextMenus[0] : null;
}

function contextMenuEventHandler() {
    const id = "custom-context-menu-id";
    const customContextMenuName = "Text-to-Speech Highlighter";
    const customContextMenuHint = "Speak";

    const contextMenuElement = getContextMenuElement();
    if (contextMenuElement) {
        const preExisting = document.querySelector("#" + id);
        if (preExisting) {
            // we need to remove the preExisting element because google docs removes all elements and recreates them.
            // it will remain at the top then next time if we don't do this
            preExisting.parentElement.removeChild(preExisting);
        }
        const separators = filterHiddenElements(contextMenuElement.querySelectorAll(".apps-hoverable-menu-separator-container"));
        if (separators.length) {
            // you can also put a custom icon in place of .docs-icon-img-container
            const innerHTML = `
                  <div class="goog-menuitem-content">
                      <div class="docs-icon goog-inline-block goog-menuitem-icon" aria-hidden="true">
                        <div class="docs-icon-img-container docs-icon-img docs-icon-editors-ia-microphone">
                        </div>
                      </div>
                      <span class="goog-menuitem-label">
                        ${customContextMenuName}
                      </span>
                      <span class="goog-menuitem-accel" aria-label="⌘X">
                        ${customContextMenuHint}
                      </span>
                  </div>`;
            // this can't be HTML text because it will handle the events like hover and click
            const div = document.createElement("div");
            div.innerHTML = innerHTML;
            div.className = "goog-menuitem apps-menuitem";
            div.id = id;
            div.setAttribute("role", "menuitem");

            // hover events
            div.addEventListener("mouseenter", e=>{
                e.target.classList.add("goog-menuitem-highlight");
            }
            );
            div.addEventListener("mouseleave", e=>{
                e.target.classList.remove("goog-menuitem-highlight");
            }
            );

            // click event
            div.addEventListener("click", onClickEventHandler);
            // put it above the first separator
            separators[0].parentElement.insertBefore(div, separators[0]);
        }
    } else {
        console.log("Could not find context menu");
    }
}


function onClickEventHandler() {
    const selection = contentUtils.getSelectionText()
    contentUtils.addSelectionTask(selection);
    alert(`#${e.target.id} has been clicked!`);
  }


document.body.addEventListener('contextmenu', contextMenuEventHandler);