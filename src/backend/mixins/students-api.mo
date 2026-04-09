import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "../lib/access-control";
import StudentLib "../lib/students";
import Types "../types/students";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  students : List.List<Types.Student>,
  nextStudentId : { var value : Nat },
) {
  // Student CRUD
  public shared ({ caller }) func createStudent(req : Types.CreateStudentRequest) : async Types.StudentPublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Staff login required");
    };
    let id = nextStudentId.value;
    nextStudentId.value += 1;
    let student = StudentLib.create(students, id, req);
    StudentLib.toPublic(student);
  };

  public query ({ caller }) func listStudents() : async [Types.StudentPublic] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Staff login required");
    };
    StudentLib.getAll(students);
  };

  public query ({ caller }) func getStudent(id : Common.StudentId) : async ?Types.StudentPublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Staff login required");
    };
    StudentLib.getById(students, id);
  };

  public shared ({ caller }) func updateStudent(req : Types.UpdateStudentRequest) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Staff login required");
    };
    StudentLib.update(students, req);
  };

  public shared ({ caller }) func deleteStudent(id : Common.StudentId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Staff login required");
    };
    StudentLib.delete(students, id);
  };

  // Admission fee management
  public shared ({ caller }) func setAdmissionFeeStatus(
    id : Common.StudentId,
    status : Common.PaymentStatus,
    paymentMethod : ?Common.PaymentMethod,
  ) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Staff login required");
    };
    StudentLib.updateAdmissionFee(students, id, status, paymentMethod);
  };

  // Monthly fee management
  public shared ({ caller }) func setMonthlyFeeStatus(
    id : Common.StudentId,
    month : Text,
    status : Common.PaymentStatus,
  ) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Staff login required");
    };
    StudentLib.updateMonthlyFee(students, id, month, status);
  };
};
