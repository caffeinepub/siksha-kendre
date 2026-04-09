import AccessControl "../lib/access-control";
import Runtime "mo:core/Runtime";

mixin (accessControlState : AccessControl.AccessControlState) {
  public shared ({ caller }) func login() : async AccessControl.UserRole {
    AccessControl.ensureInitialized(accessControlState, caller);
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      accessControlState.roles.add(caller, #user);
    };
    AccessControl.getUserRole(accessControlState, caller);
  };

  public query ({ caller }) func getMyRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };
};
