# AMPD Coding Challenge

## System Requirements
- Node v18.19.0
- Yarn

## Build Steps
- ```yarn```
- ```yarn start:prod```

## Assumptions
While a real-world project would involve a lot of back-and-forth over definitions, in the interest of time I have made certain assumptions and done my best to document them below.
- devices.csv:
    - timezone is the ISO TZ identifier of the device's timezone
- device-saving.csv:
    - Each row represents the total amount of carbon emissions and diesel saved in a 30 minute period ending in device_timestamp
    - timestamp is the Hong Kong server time when the savings data is recorded
    - carbon_saved is the amount of carbon savings (in kg) during the period
    - fueld_saved is the amount  of diesel savings (in litres) during the period
- Mock UI:
    - The UI shows the savings data for a **single device**
    - Estimated "Total" savings refer to the total carbon and diesel savings provided by the device during its entire lifetime.
    - Estimated "Monthly" savings refer to the carbon and diesel savings provided by a device during the current calendar month.

## Design decisions and thoughts
- We can divide the UI into two halves.
    - The "Savings Summary" section consisting of the top half of the page with the "Estimated carbon savings" and "Estimated diesel savings" sections.
    - The "Savings Graph" section consisting of an interactive graph showing the device's saving data and controls for zooming in and out.
    - To my knowledge, AMPD builds mobile generators for construction sites
        - i.e. possibly network-constrained environments
- Database schema
    - Timestamps are stored in UNIX timestamp format. Time zones should be handled in application code.
- Included a stub API endpoint for downloading the savings calculations guidelines for the sake of completeness.
- Included a Dockerfile to test code in Linux environment.

## Limitations
- 