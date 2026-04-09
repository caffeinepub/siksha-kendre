import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Common "../types/common";

module {
  // Deterministic password hash — combines username + password + static salt
  public func hashPassword(username : Text, password : Text) : Text {
    username # "::" # password # "::adarsh_siksha_kendre_salt_2005";
  };

  public type AuthState = {
    users : Map.Map<Text, Common.UserAccount>;    // username -> UserAccount
    sessions : Map.Map<Text, Common.SessionInfo>; // token -> SessionInfo
    var adminExists : Bool;
    var tokenCounter : Nat;
  };

  public func initState() : AuthState {
    {
      users = Map.empty<Text, Common.UserAccount>();
      sessions = Map.empty<Text, Common.SessionInfo>();
      var adminExists = false;
      var tokenCounter = 0;
    };
  };

  func makeToken(username : Text, counter : Nat) : Text {
    username # "_tok_" # debug_show(counter);
  };

  public func signup(state : AuthState, username : Text, password : Text) : Common.AuthResult {
    if (username.size() == 0 or password.size() == 0) {
      return #err("Username and password are required");
    };
    if (state.users.containsKey(username)) {
      return #err("Username already exists");
    };
    if (state.adminExists) {
      return #err("Registration is closed. Only admin can create staff accounts.");
    };
    let hash = hashPassword(username, password);
    let account : Common.UserAccount = {
      username;
      var passwordHash = hash;
      role = #admin;
    };
    state.users.add(username, account);
    state.adminExists := true;
    state.tokenCounter += 1;
    let token = makeToken(username, state.tokenCounter);
    state.sessions.add(token, { username; role = #admin });
    #ok(token);
  };

  public func login(state : AuthState, username : Text, password : Text) : Common.AuthResult {
    if (username.size() == 0 or password.size() == 0) {
      return #err("Username and password are required");
    };
    switch (state.users.get(username)) {
      case null { #err("Invalid username or password") };
      case (?account) {
        let hash = hashPassword(username, password);
        if (account.passwordHash != hash) {
          return #err("Invalid username or password");
        };
        state.tokenCounter += 1;
        let token = makeToken(username, state.tokenCounter);
        state.sessions.add(token, { username; role = account.role });
        #ok(token);
      };
    };
  };

  public func logout(state : AuthState, token : Text) {
    state.sessions.remove(token);
  };

  public func getSession(state : AuthState, token : Text) : ?Common.SessionInfo {
    state.sessions.get(token);
  };

  public func requireSession(state : AuthState, token : Text) : Common.SessionInfo {
    switch (state.sessions.get(token)) {
      case (?s) s;
      case null { Runtime.trap("Unauthorized: Invalid or expired session") };
    };
  };

  public func requireAdmin(state : AuthState, token : Text) : Common.SessionInfo {
    let session = requireSession(state, token);
    switch (session.role) {
      case (#admin) session;
      case _ { Runtime.trap("Unauthorized: Admin access required") };
    };
  };

  public func createStaff(state : AuthState, adminToken : Text, username : Text, password : Text) : Common.AuthResult {
    ignore requireAdmin(state, adminToken);
    if (username.size() == 0 or password.size() == 0) {
      return #err("Username and password are required");
    };
    if (state.users.containsKey(username)) {
      return #err("Username already exists");
    };
    let hash = hashPassword(username, password);
    let account : Common.UserAccount = {
      username;
      var passwordHash = hash;
      role = #staff;
    };
    state.users.add(username, account);
    #ok("Staff account created");
  };

  public func listStaff(state : AuthState, adminToken : Text) : [Common.StaffInfo] {
    ignore requireAdmin(state, adminToken);
    let result = List.empty<Common.StaffInfo>();
    for ((_, account) in state.users.entries()) {
      result.add({ username = account.username; role = account.role });
    };
    result.toArray();
  };

  public func deleteStaff(state : AuthState, adminToken : Text, username : Text) : Bool {
    ignore requireAdmin(state, adminToken);
    if (not state.users.containsKey(username)) {
      return false;
    };
    switch (state.users.get(username)) {
      case (? { role = #admin }) {
        Runtime.trap("Cannot delete admin account");
      };
      case _ {};
    };
    state.users.remove(username);
    // Collect tokens to remove
    let toRemove = List.empty<Text>();
    for ((tok, sess) in state.sessions.entries()) {
      if (sess.username == username) {
        toRemove.add(tok);
      };
    };
    for (tok in toRemove.values()) {
      state.sessions.remove(tok);
    };
    true;
  };
};
