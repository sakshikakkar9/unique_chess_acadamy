import React, { useMemo } from "react";
import { Tournament } from "@/types";
import { TournamentPublicView } from "../public/TournamentPublicView";
import { resolveRegistrationStatus } from "@/lib/statusUtils";

interface TournamentPreviewProps {
  tournament: Tournament;
}

const TournamentPreview: React.FC<TournamentPreviewProps> = ({ tournament }) => {
  const regStatus = useMemo(() => {
    return resolveRegistrationStatus(
      tournament.startDate,
      tournament.endDate,
      tournament.regStartDate,
      tournament.regEndDate,
      tournament.status
    );
  }, [tournament]);

  return (
    <div className="bg-slate-50 p-4 sm:p-8 rounded-[2rem] border border-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
           <div>
              <h2 className="text-xl font-bold text-slate-900">Tournament Preview</h2>
              <p className="text-sm text-slate-500">This is exactly how players see your tournament page.</p>
           </div>
           <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Live Preview</span>
        </div>
        <TournamentPublicView
          tournament={tournament}
          isPreview={true}
          registrationStatus={regStatus}
          isRegistrationDisabled={regStatus !== "OPEN"}
        />
      </div>
    </div>
  );
};

export default TournamentPreview;
