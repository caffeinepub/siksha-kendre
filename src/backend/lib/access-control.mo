import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

module {
  public type UserRole = {
    #admin;
    #user;
    #guest;
  };

  public type AccessControlState = {
    roles : Map.Map<Principal, UserRole>;
    var initialized : Bool;
  };

  public func initState() : AccessControlState {
    {
      roles = Map.empty<Principal, UserRole>();
      var initialized = false;
    };
  };

  public func getUserRole(state : AccessControlState, caller : Principal) : UserRole {
    switch (state.roles.get(caller)) {
      case (?role) role;
      case null #guest;
    };
  };

  public func isAdmin(state : AccessControlState, caller : Principal) : Bool {
    switch (state.roles.get(caller)) {
      case (? #admin) true;
      case _ false;
    };
  };

  public func hasPermission(state : AccessControlState, caller : Principal, requiredRole : UserRole) : Bool {
    let userRole = getUserRole(state, caller);
    switch (requiredRole) {
      case (#guest) true;
      case (#user) {
        switch (userRole) {
          case (#admin) true;
          case (#user) true;
          case (#guest) false;
        };
      };
      case (#admin) {
        switch (userRole) {
          case (#admin) true;
          case _ false;
        };
      };
    };
  };

  public func ensureInitialized(state : AccessControlState, caller : Principal) {
    if (not state.initialized) {
      state.roles.add(caller, #admin);
      state.initialized := true;
    };
  };

  public func assignRole(state : AccessControlState, caller : Principal, user : Principal, role : UserRole) {
    if (not isAdmin(state, caller)) {
      Runtime.trap("Unauthorized: Only admins can assign roles");
    };
    state.roles.add(user, role);
  };
};
