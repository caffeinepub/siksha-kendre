import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Types "../types/students";
import Common "../types/common";

module {
  public type StudentList = List.List<Types.Student>;

  public func toPublic(s : Types.Student) : Types.StudentPublic {
    {
      id = s.id;
      name = s.name;
      mobileNumber = s.mobileNumber;
      dateOfBirth = s.dateOfBirth;
      fatherName = s.fatherName;
      motherName = s.motherName;
      class_ = s.class_;
      admissionFee = s.admissionFee;
      monthlyFees = s.monthlyFees;
    };
  };

  public func create(
    students : StudentList,
    nextId : Nat,
    req : Types.CreateStudentRequest,
  ) : Types.Student {
    let defaultFee : Types.AdmissionFee = {
      status = #Pending;
      paymentMethod = null;
    };
    let defaultMonthly : Types.MonthlyFee = {
      jan = #Pending;
      feb = #Pending;
      mar = #Pending;
      apr = #Pending;
      may = #Pending;
      jun = #Pending;
      jul = #Pending;
      aug = #Pending;
      sep = #Pending;
      oct = #Pending;
      nov = #Pending;
      dec = #Pending;
    };
    let student : Types.Student = {
      id = nextId;
      var name = req.name;
      var mobileNumber = req.mobileNumber;
      var dateOfBirth = req.dateOfBirth;
      var fatherName = req.fatherName;
      var motherName = req.motherName;
      var class_ = req.class_;
      var admissionFee = defaultFee;
      var monthlyFees = defaultMonthly;
    };
    students.add(student);
    student;
  };

  public func getAll(students : StudentList) : [Types.StudentPublic] {
    students.map<Types.Student, Types.StudentPublic>(toPublic).toArray();
  };

  public func getById(students : StudentList, id : Common.StudentId) : ?Types.StudentPublic {
    switch (students.find(func(s : Types.Student) : Bool { s.id == id })) {
      case (?s) ?toPublic(s);
      case null null;
    };
  };

  public func update(students : StudentList, req : Types.UpdateStudentRequest) : Bool {
    switch (students.find(func(s : Types.Student) : Bool { s.id == req.id })) {
      case null false;
      case (?s) {
        s.name := req.name;
        s.mobileNumber := req.mobileNumber;
        s.dateOfBirth := req.dateOfBirth;
        s.fatherName := req.fatherName;
        s.motherName := req.motherName;
        s.class_ := req.class_;
        true;
      };
    };
  };

  public func delete(students : StudentList, id : Common.StudentId) : Bool {
    let sizeBefore = students.size();
    let filtered = students.filter(func(s : Types.Student) : Bool { s.id != id });
    students.clear();
    students.append(filtered);
    students.size() < sizeBefore;
  };

  public func updateAdmissionFee(
    students : StudentList,
    id : Common.StudentId,
    status : Common.PaymentStatus,
    paymentMethod : ?Common.PaymentMethod,
  ) : Bool {
    switch (students.find(func(s : Types.Student) : Bool { s.id == id })) {
      case null false;
      case (?s) {
        s.admissionFee := { status; paymentMethod };
        true;
      };
    };
  };

  public func updateMonthlyFee(
    students : StudentList,
    id : Common.StudentId,
    month : Text,
    status : Common.PaymentStatus,
  ) : Bool {
    switch (students.find(func(s : Types.Student) : Bool { s.id == id })) {
      case null false;
      case (?s) {
        let current = s.monthlyFees;
        let updated : Types.MonthlyFee = switch (month) {
          case "jan" { { current with jan = status } };
          case "feb" { { current with feb = status } };
          case "mar" { { current with mar = status } };
          case "apr" { { current with apr = status } };
          case "may" { { current with may = status } };
          case "jun" { { current with jun = status } };
          case "jul" { { current with jul = status } };
          case "aug" { { current with aug = status } };
          case "sep" { { current with sep = status } };
          case "oct" { { current with oct = status } };
          case "nov" { { current with nov = status } };
          case "dec" { { current with dec = status } };
          case _ { Runtime.trap("Invalid month: " # month) };
        };
        s.monthlyFees := updated;
        true;
      };
    };
  };
};
