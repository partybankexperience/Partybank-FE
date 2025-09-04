import { useNavigate } from 'react-router';
import DefaultButton from '../../components/buttons/DefaultButton';
import DefaultInput from '../../components/inputs/DefaultInput';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useState } from 'react';
import { SetProfile } from '../../Containers/onBoardingApi';

const ProfileInfo = () => {
  const navigate = useNavigate();
  const { markStepComplete, updateOnboardingStep } = useOnboardingStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setisLoading] = useState(false);

  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; phone?: string }>(
    {},
  );

  const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fn = firstName.trim();
    const ln = lastName.trim();
    const ph = phone.trim();

    const nextErrors: typeof errors = {};
    if (!fn) nextErrors.firstName = 'First name is required';
    if (!ln) nextErrors.lastName = 'Last name is required';
    // (Optional) very soft phone check
    if (ph && ph.length < 6) nextErrors.phone = 'Phone looks too short';

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});

    const fullName = `${fn} ${ln}`;

    try {
      setisLoading(true);
      const res = await SetProfile(fullName, businessName.trim(), ph);
      if (res?.currentStep) updateOnboardingStep(res.currentStep);
      markStepComplete('profileInformation');
      navigate('/pin-setup', { replace: true });
    } catch (error) {
      // You can surface a toast here if you like
    } finally {
      setisLoading(false);
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <form
      className="flex flex-col flex-grow justify-between h-full px-[20px] md:px-0"
      onSubmit={handleNext}
      noValidate
    >
      <div className="h-fit grid gap-[32px] md:gap-[40px]">
        <h1 className="text-[24px] md:text-[36px] font-bold text-black text-center">
          Profile Information
        </h1>

        {/* Form fields container */}
        <div className="grid w-full md:w-3/4 lg:w-1/2 md:m-auto gap-[16px] md:gap-[20px]">
          {/* Names: stacked on mobile, side-by-side on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] md:gap-[20px]">
            <div>
              <DefaultInput
                id="profileInfoFirstName"
                label="First Name"
                placeholder="Enter first name"
                type="text"
                style="!w-full"
                value={firstName}
                setValue={(v: string) => setFirstName(v)}
                required
                autoComplete="given-name"
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
            </div>

            <div>
              <DefaultInput
                id="profileInfoLastName"
                label="Last Name"
                placeholder="Enter last name"
                type="text"
                style="!w-full"
                value={lastName}
                setValue={(v: string) => setLastName(v)}
                required
                autoComplete="family-name"
              />
              {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
            </div>
          </div>

          <DefaultInput
            id="profileInfoBusinessName"
            label="Business Name"
            placeholder="Enter business name"
            type="text"
            style="!w-full"
            value={businessName}
            setValue={setBusinessName}
            autoComplete="organization"
          />

          <div>
            <DefaultInput
              id="phone"
              label="Phone Number"
              type="tel"
              value={phone}
              setValue={setPhone}
              placeholder="Enter phone number"
              autoComplete="tel"
              inputMode="numeric" // mobile keypad
              pattern="\d*" // extra HTML validation (optional)
              maxLength={15} // optional
              allowPlus // to allow plus
              style="!w-full"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-[12px] md:gap-[20px] items-center mx-auto w-full md:w-auto md:!mx-auto">
        <DefaultButton
          type="default"
          variant="tertiary"
          className="!w-full md:!w-fit md:!mx-auto"
          onClick={handleBack}
        >
          Back
        </DefaultButton>
        <DefaultButton
          type="default"
          variant="primary"
          className="!w-full md:!w-fit md:!mx-auto"
          submitType="submit"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Next
        </DefaultButton>
      </div>
    </form>
  );
};

export default ProfileInfo;
