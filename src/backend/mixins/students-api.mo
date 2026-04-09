import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "../lib/access-control";
import StudentLib "../lib/students";
import Types "../types/students";
import Common "../types/common";

mixin (
  authState : AccessControl.AuthState,
  students : List.List<Types.Student>,
  nextStudentId : { var value : Nat },
) {
  // Student CRUD — all operations require a valid session token as first argument

  public shared func createStudent(token : Text, req : Types.CreateStudentRequest) : async Types.StudentPublic {
    ignore AccessControl.requireSession(authState, token);
    let id = nextStudentId.value;
    nextStudentId.value += 1;
    let student = StudentLib.create(students, id, req);
    StudentLib.toPublic(student);
  };

  public query func listStudents(token : Text) : async [Types.StudentPublic] {
    ignore AccessControl.requireSession(authState, token);
    StudentLib.getAll(students);
  };

  public query func getStudent(token : Text, id : Common.StudentId) : async ?Types.StudentPublic {
    ignore AccessControl.requireSession(authState, token);
    StudentLib.getById(students, id);
  };

  public shared func updateStudent(token : Text, req : Types.UpdateStudentRequest) : async Bool {
    ignore AccessControl.requireSession(authState, token);
    StudentLib.update(students, req);
  };

  public shared func deleteStudent(token : Text, id : Common.StudentId) : async Bool {
    ignore AccessControl.requireSession(authState, token);
    StudentLib.delete(students, id);
  };

  // Admission fee management
  public shared func setAdmissionFeeStatus(
    token : Text,
    id : Common.StudentId,
    status : Common.PaymentStatus,
    paymentMethod : ?Common.PaymentMethod,
  ) : async Bool {
    ignore AccessControl.requireSession(authState, token);
    StudentLib.updateAdmissionFee(students, id, status, paymentMethod);
  };

  // Monthly fee management
  public shared func setMonthlyFeeStatus(
    token : Text,
    id : Common.StudentId,
    month : Text,
    status : Common.PaymentStatus,
  ) : async Bool {
    ignore AccessControl.requireSession(authState, token);
    StudentLib.updateMonthlyFee(students, id, month, status);
  };
};
