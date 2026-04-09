import Common "common";

module {
  public type StudentId = Common.StudentId;
  public type PaymentStatus = Common.PaymentStatus;
  public type PaymentMethod = Common.PaymentMethod;
  public type StudentClass = Common.StudentClass;

  public type MonthlyFee = {
    jan : PaymentStatus;
    feb : PaymentStatus;
    mar : PaymentStatus;
    apr : PaymentStatus;
    may : PaymentStatus;
    jun : PaymentStatus;
    jul : PaymentStatus;
    aug : PaymentStatus;
    sep : PaymentStatus;
    oct : PaymentStatus;
    nov : PaymentStatus;
    dec : PaymentStatus;
  };

  public type AdmissionFee = {
    status : PaymentStatus;
    paymentMethod : ?PaymentMethod;
  };

  public type Student = {
    id : StudentId;
    var name : Text;
    var mobileNumber : Text;
    var dateOfBirth : Text;
    var fatherName : Text;
    var motherName : Text;
    var class_ : StudentClass;
    var admissionFee : AdmissionFee;
    var monthlyFees : MonthlyFee;
  };

  // Shared (immutable) version for API boundary
  public type StudentPublic = {
    id : StudentId;
    name : Text;
    mobileNumber : Text;
    dateOfBirth : Text;
    fatherName : Text;
    motherName : Text;
    class_ : StudentClass;
    admissionFee : AdmissionFee;
    monthlyFees : MonthlyFee;
  };

  public type CreateStudentRequest = {
    name : Text;
    mobileNumber : Text;
    dateOfBirth : Text;
    fatherName : Text;
    motherName : Text;
    class_ : StudentClass;
  };

  public type UpdateStudentRequest = {
    id : StudentId;
    name : Text;
    mobileNumber : Text;
    dateOfBirth : Text;
    fatherName : Text;
    motherName : Text;
    class_ : StudentClass;
  };
};
