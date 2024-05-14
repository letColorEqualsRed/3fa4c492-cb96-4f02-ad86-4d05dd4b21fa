# AMPD Coding Challenge

## System Requirements
- Node v18.19.0
- Yarn
- Docker (if using Docker to run server)

## Build Steps
- To run server:
    - ```cd server```
    - ```yarn```
    - ```yarn start:prod```
    - A table containing sample API calls will be printed to console once server is ready to accept incoming requests
- To run server (using Docker)
    - ```cd server```
    - ```./docker-build.sh```
    - ```./docker-run.sh```
    - A table containing sample API calls will be printed to console once server is ready to accept incoming requests
- To run sample UI
    - ```cd app```
    - ```yarn```
    - ```yarn dev```

## Assumptions
While a real-world project would involve a lot of back-and-forth over definitions, in the interest of time I have made certain assumptions and done my best to document them below.
- devices.csv:
    - timezone is the IANA identifier of the device's timezone
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
        - Application might need to work in network-constrained environments
    - As a result, I have created separate API endpoints to serve the Summary and Graph sections as this allows us to use a more aggressive caching strategy for the Summary section
- Database schema
    - Timestamps are stored in UNIX timestamp format. Time zones should be handled in application code.
- Included a Dockerfile to test code in Linux environment.