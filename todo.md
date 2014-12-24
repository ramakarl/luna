
GUI elements
============

  - region
  - button
    * ~~button (spring load)~~
    * ~~button (toggle)~~
  - ~~scrollbar~~
  - ~~toolbar~~
    * still needs some jumble functionality
  - treeview
  - dropdown
  - listbox
  - textbox, textarea, entrybox, entryline
  - ~~slider~~
  - ~~spinner~~

  - colorbar
  - directoryline
  - filebrowser
  - propertybox
  - render2d
  - render3d

Top level design
================

  - luna_render - rendering engine
  - luna_scene - storage and management of GUI tree
  - luna_message - message 'queue' for GUI objects
  - luna_input - GUI input handling


Events
======

###  Event Order

  - Parent
  - Named destination
  - Custom callback
  - System callback


### Ideas

  There might be a better way to do event handling.  Here's a proposal:

    - Events are handled by a central dispatcher
    - elements (gui or otherwise) can subscribe to 'channels' that
      pass communication information around
    - elements can publish to channels to communicate with everyone
      who needs a signal.
