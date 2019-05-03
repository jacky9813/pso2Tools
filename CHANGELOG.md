# [0.1.8-beta]
(TBC)
## New features
Added(Emergency Module): New animation when any event is 15 mins before occuring

## Fixed / Changed
Changed(Emergency Module): Changed running event's animation to distinguish from preparing animation

# [0.1.7-beta]
(2019-05-02)
## New features
- Emergency module: Currently happening event will blink its background

## Fixed / Changed
- Fixed(Emergency Module):    Bad visual when using day time mode
- Changed(ChatLog Module):    New GROUP channel is now supported
- Changed(ClassLevel Module): Phantom is added
- Changed(Emergency Module):  Live event is now supported

# [0.1.6-beta]
(2019-03-02)
## New module
- devToolOpen Module : Chrome DevTools opener (will show up when --dev is specified)

## New feature
- Emergnecy module is now included Arks League, thus renaming its tab label to Event

## Fixed / Changed
- Changed: Upgraded electron from 2.0.2 to 4.0.6
- Chenged: Width of the window will always greater or equal to 900 pixels now.
- Changed(ClassLevel Module): Change class level limit to current PSO2 limit
- Fixed(Emergency Module): Malfunctions if user uses it when it's Wednesday.
- Fixed(Emergency Module): Emergency Quest disappears 30 mins before starts.
- Fixed(Emergency Module): Emergency start time can be wrong at the starting of the month.

# [0.1.5-beta]
(2019-01-26)
## New module
- Emergency Module: get emergency quest time table from PSO2.jp

## New feature
- Chat Log now has channel filter.
- use "--dev" to open PSO2 Utility will open devTools.

## Improved / Fixed
- Fixed installation issue that may leads TACounter module to misbehave.

# [0.1.4-beta]
(2018-06-19)
## New feature
- Modules now can add a tab for it's own purpose (whether it's for module settings or to show other things)

## New module
- ChatLog Module: reads your PSO2 Chat log and display it like in game, sort of
- Links Module: provides a storage of links that often used while playing PSO2

## Improved / Fixed
- Fixed: Stylesheet and window buttons won't load until all babel script has been compiled and loaded

# [0.1.3-beta]
(2018-06-15)
## New feature
- Switch day / night style by clicking light bulb

## Improved / Fixed
- Scroll bar will never appear beside title bar anymore
- TACounter module: fixed styling error when user set TA mission from available to unavailable 

# [0.1.2-beta]
(2018-06-13)
## Fixed Issues
- TA time loss when database upgrading (which didn't fix in 0.1.1-beta)

# [0.1.1-beta]
(2018-06-13)
## Fixed Issues
- Database upgrade rerun after upgraded, which will cause TA time loss

# [0.1.0-beta]
(2018-06-06)
### New feature
- Introduced React.js to this application
- Rewrite whole system, making it more modulized

# [0.0.3-alpha]
(2017-09-20)
### New feature
- A links page to store useful website links, and it auto fetches the title of that web page.
- Extreme Quest level logging

### Improved
- After refresh the page, automatically opens the tab was active before refresh.

# [0.0.2-alpha]
(2017-08-29)
### New feature
- A little memo for every character
- Auto upgrade database to meet latest features

### Added
- A version information is now right below the page

### Improved
- Displays TA cooldown time at main table.
- Use ● as a indicator of TA cooldown status instrad of changing background.

# [0.0.1-alpha] 
(2017-08-28)
### Added
- Time Attack Management.