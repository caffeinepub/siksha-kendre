import Map "mo:core/Map";
import List "mo:core/List";
import StudentTypes "types/students";

module {
  // Old auth state (Internet Identity-based) — defined inline, not imported from .old/
  type OldUserRole = { #admin; #guest; #user };
  type OldAccessControlState = {
    var initialized : Bool;
    roles : Map.Map<Principal, OldUserRole>;
  };

  // Old actor stable fields
  type OldActor = {
    accessControlState : OldAccessControlState;
    students : List.List<StudentTypes.Student>;
    nextStudentId : { var value : Nat };
  };

  // New actor stable fields (authState is excluded — it will be freshly initialised)
  type NewActor = {
    students : List.List<StudentTypes.Student>;
    nextStudentId : { var value : Nat };
  };

  public func run(old : OldActor) : NewActor {
    // Discard accessControlState (auth system replaced with username/password)
    // Preserve all student records and the ID counter
    {
      students = old.students;
      nextStudentId = old.nextStudentId;
    };
  };
};
