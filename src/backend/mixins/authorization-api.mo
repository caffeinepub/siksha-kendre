import AccessControl "../lib/access-control";
import Common "../types/common";

mixin (authState : AccessControl.AuthState) {
  /// First-time signup: creates the admin account. Subsequent calls are rejected.
  public shared func signup(username : Text, password : Text) : async Common.AuthResult {
    AccessControl.signup(authState, username, password);
  };

  /// Login with username + password. Returns a session token on success.
  public shared func login(username : Text, password : Text) : async Common.AuthResult {
    AccessControl.login(authState, username, password);
  };

  /// Logout and invalidate the session token.
  public shared func logout(token : Text) : async () {
    AccessControl.logout(authState, token);
  };

  /// Get current session info for a token (returns null if invalid).
  public query func getSession(token : Text) : async ?Common.SessionInfo {
    AccessControl.getSession(authState, token);
  };

  /// Admin only: create a staff account.
  public shared func createStaff(adminToken : Text, username : Text, password : Text) : async Common.AuthResult {
    AccessControl.createStaff(authState, adminToken, username, password);
  };

  /// Admin only: list all user accounts.
  public query func listStaff(adminToken : Text) : async [Common.StaffInfo] {
    AccessControl.listStaff(authState, adminToken);
  };

  /// Admin only: delete a staff account by username.
  public shared func deleteStaff(adminToken : Text, username : Text) : async Bool {
    AccessControl.deleteStaff(authState, adminToken, username);
  };
};
