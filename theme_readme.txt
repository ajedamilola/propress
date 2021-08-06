a theme must have all stylesheet in it;s ejs file
The data it must be able to process is:
    posts:Array
    menu:Array{
        any menu with child attribute set true must be a submenu of another menu,
        each menu array has children:Array of strings,
        those strings are used to compare with the Name Attributes of other menuItems that has child atrribute true,
    }
must have conditional statement for the "page" value
{
    page=="home",
    page=="a_page",
    page==a_page_cat"
}