# geektool-desk

Content for my geektool desktop.

## Scripts

All scripts are node.js.

### os_downloads

Download statistics for npm projects. Returns only the amount of downloads of a project at a specific time period.

    node os_downloads.js projectName timePeriod [additionalOptions]

* projectName - name of the project at the npm registry
* timePeriod - predefined time periods, can be one of these
  * today
  * yesterday
  * current-week
  * last-week
  * past-week
  * current-month
  * last-month
  * past-month
* additionalOptions - only available for past-month and past-week time period, set's how much we go back at the months or the weeks

Examples, let's say we have the date `2013-06-23`:

    os_downloads.js cushion yesterday // get dl stats for 2013-06-22
    os_downloads.js cushion last-month // get dl stats from 2013-05-01 to 2013-05-31
    os_downloads.js cushion past-month 3 // get dl stats from 2013-03-01 to 2013-03-31
    os_downloads.js cushion last-week // get del stats from 2013-06-10 to 2013-06-16
    