import SurveyForm from '../components/SurveyForm';

export default function Page() {
  return (
    <main>
      <h1 className="text-3xl font-semibold mb-2">What do you want?</h1>
      <p className="text-gray-600 mb-6">Share your idea and we\'ll follow up.</p>
      <SurveyForm />
    </main>
  );
}
