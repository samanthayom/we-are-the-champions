# We Are The Champions
By Samantha Yom Jingyi

## Running Locally
Use the `.env.example` file to ensure that you have all the required environment variables, then run the app locally with: 
```docker compose up --build```

The UI can be access on `localhost:3000`.

## Walkthrough
In [this Loom](https://www.loom.com/share/dbad314f2f024584881a0ce0054077ad?sid=8c9bf195-a460-47a5-bc92-7b9153c2f5d5), I do a quick walkthrough of my application, disucssing my interpretation of the requirements. 


I also summarise some of my points below.

## Key Features
* Users can enter team information and match results, where invalid input is handled gracefully through error messages.
* Teams are mapped to their information and match results, which users can easily modify
* Changes to team and match results are logged, along with API requests

## Assumptions
Several assumptions were made with regard to the computation of rankings and input validation:
* There can only be exactly two groups, each with exactly 6 teams - rankings are not generated if this is not the case
* Any two teams only play against each other once, and only teams in the same group play against each other 

As for the user experience, I assumed that users would want to modify team and match results (especially the latter) in relation to the team they have selected.
