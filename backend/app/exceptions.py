class TeamCreationError(Exception):
    """
    Exception raised when there is an error creating a team (e.g., team name not unique)
    """
    def __init__(self, reason: str):
        self.message = f"Error creating team: {reason}"
        super().__init__(self.message)


class TeamUpdateError(Exception):
    """
    Exception raised when there is an error updating a team (e.g., team name already exists)
    """
    def __init__(self, team_id: str, reason: str):
        self.message = f"Error updating team (ID: {team_id}): {reason}"
        super().__init__(self.message)


class TeamNotFoundError(Exception):
    """
    Exception raised when a team(s) is not found
    """
    def __init__(self, team_name=None, team_id=None):
        self.message = f"Team {team_name} not found" if team_name else f"Team (ID: {team_id}) not found"
        super().__init__(self.message)
    

class MatchCreationError(Exception):
    """
    Exception raised when there is an error creating a match (e.g., duplicate match)
    """
    def __init__(self, reason: str):
        self.message = f"Error creating match: {reason}"
        super().__init__(self.message)


class MatchUpdateError(Exception):
    """
    Exception raised when there is an error updating a match (e.g., invalid match data)
    """
    def __init__(self, reason: str):
        self.message = f"Error updating match: {reason}"
        super().__init__(self.message)


class MatchNotFoundError(Exception):
    """
    Exception raised when a match is not found
    """
    def __init__(self, match_id: str):
        self.message = f"Match (ID: {match_id}) not found"
        super().__init__(self.message)